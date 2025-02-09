import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import math
import warnings
from datetime import datetime
from sklearn.model_selection import train_test_split, cross_validate, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Dense, LSTM

# Suppress warnings
warnings.filterwarnings('ignore')

def load_data(file_path):
    data = pd.read_csv(file_path)
    return data

# Update your file path here
file_path = 'path/to/your/solar_data.csv'  # Ensure this points to your actual CSV file

data = load_data(file_path)

# Calculate zenith angle
def calculate_zenith_angle(row):
    if row['SZA'] != -999:
        return row['SZA']
    
    day = row['DY']
    hour = row['HR']
    
    delta = 23.45 * math.sin(360 * (day - 80) / 365)  # Declination angle
    omega = 15 * (hour - 12)  # Hour angle
    theta = math.acos((math.sin(23.03) * math.sin(delta)) + (math.cos(23.03) * math.cos(delta) * math.cos(omega)))
    
    return 90 - theta

# Data preprocessing
def preprocess_data(df):
    df['new_SZA'] = df.apply(calculate_zenith_angle, axis=1)
    df['tilt'] = 90 - df['new_SZA']
    df.drop(['SZA', 'new_SZA'], axis=1, inplace=True)

    # Filter invalid data
    df = df[(df['CLRSKY_SFC_SW_DWN'] != -999) & 
             (df['ALLSKY_SFC_SW_DWN'] != -999) & 
             (df['ALLSKY_KT'] != -999) & 
             (df['ALLSKY_SRF_ALB'] != -999)]

    df.reset_index(drop=True, inplace=True)
    return df

# Plot correlation heatmap
def plot_correlation_heatmap(df):
    plt.figure(figsize=(10, 6))
    sns.heatmap(df.corr(), annot=True, cmap='coolwarm')
    plt.show()

# Split data into train and test sets
def split_data(df):
    data_df = df.drop(['tilt'], axis=1)
    X_train, X_test, y_train, y_test = train_test_split(data_df, df["tilt"], random_state=42, test_size=0.20)
    return X_train, X_test, y_train, y_test

# Scale the data
def scale_data(X_train, X_test):
    scaler = StandardScaler().fit(X_train)
    X_train_scaled = scaler.transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    return X_train_scaled, X_test_scaled

# Train and evaluate models
def evaluate_models(X_train_scaled, y_train, X_test_scaled, y_test):
    models = {
        'Linear Regression': LinearRegression(),
        'Decision Tree': DecisionTreeRegressor(random_state=12345),
        'Random Forest': RandomForestRegressor(random_state=12345),
        'XGB': XGBRegressor(random_state=12345, tree_method="hist"),
    }
    score_types = ['neg_mean_absolute_error', 'neg_mean_squared_error']
    model_results = pd.DataFrame()

    for model_name, model in models.items():
        scores = cross_validate(model, X_train_scaled, y_train, cv=5, scoring=score_types, return_train_score=True)
        
        # Calculate metrics
        train_mae = -scores['train_neg_mean_absolute_error'].mean()
        val_mae = -scores['test_neg_mean_absolute_error'].mean()
        train_rmse = np.sqrt(-scores['train_neg_mean_squared_error']).mean()
        val_rmse = np.sqrt(-scores['test_neg_mean_squared_error']).mean()

        # Fit and test model
        model.fit(X_train_scaled, y_train)
        predictions = model.predict(X_test_scaled)
        test_mae = mean_absolute_error(y_test, predictions)
        test_rmse = mean_squared_error(y_test, predictions)

        model_results.loc[model_name] = [train_mae, val_mae, train_rmse, val_rmse, test_mae, test_rmse]

    return model_results

# Hyperparameter tuning
def hyperparameter_tuning(X_train_scaled, y_train):
    model_dict = {
        'Random Forest': {
            'model': RandomForestRegressor(random_state=12345, n_jobs=-1), 
            'params': {'n_estimators': list(range(5, 50, 5)), 'min_samples_split': [2, 5, 10]}
        },
        'XGB': {
            'model': XGBRegressor(random_state=12345, n_jobs=-1),
            'params': {
                'max_depth': [6, 7, 9],
                'n_estimators': list(range(5, 50, 5)),
                'learning_rate': [0.1, 0.2, 0.3, 0.4, 0.5],
                'subsample': [0.2, 0.3, 0.4],
                'gamma': [0, 0.5, 0.6, 0.7],
                'reg_lambda': [0, 1, 5, 10]
            }
        }
    }
    
    best_model = None
    best_score = -math.inf

    for model_name, reg_model in model_dict.items():
        hyper_tuning_model = RandomizedSearchCV(reg_model['model'], reg_model['params'], 
                                                 n_iter=10, cv=5, return_train_score=True, 
                                                 scoring='neg_mean_squared_error', refit='neg_mean_squared_error')
        hyper_tuning_model.fit(X_train_scaled, y_train)

        model_res = hyper_tuning_model.best_estimator_
        best_model_score = hyper_tuning_model.best_score_

        print(f"{model_name} :: {best_model_score} {hyper_tuning_model.best_params_}")

        if best_model_score > best_score:
            best_score = best_model_score
            best_model = model_res

    print('Best Model :: ', best_model)
    return best_model

# Prepare data for LSTM
def prepare_lstm_data(df, training_data_len):
    data = df.drop(['YEAR', 'MO', 'DY', 'HR', 'date_time'], axis=1)
    dataset = data.values
    scaled_data = MinMaxScaler(feature_range=(0, 1)).fit_transform(dataset)

    train_data = scaled_data[0:int(training_data_len), :]
    x_train, y_train = [], []

    for i in range(120, len(train_data)):
        x_train.append(train_data[i-120:i, :-1])
        y_train.append(train_data[i, -1])

    return np.array(x_train), np.array(y_train), scaled_data

# Build LSTM model
def build_lstm_model(input_shape):
    model = Sequential()
    model.add(LSTM(128, return_sequences=True, input_shape=input_shape))
    model.add(LSTM(64, return_sequences=False))
    model.add(Dense(25))
    model.add(Dense(1))
    
    model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])
    return model

# Plot training loss
def plot_training_loss(history):
    plt.plot(history.history['loss'], 'g')
    plt.plot(history.history['val_loss'], 'b')
    plt.title('Model loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend(['Train', 'Validation'], loc='best')
    plt.savefig('Model_loss.png')
    plt.show()

# Main function to orchestrate the workflow
def main(file_path):
    df = load_data(file_path)
    df = preprocess_data(df)
    plot_correlation_heatmap(df)

    X_train, X_test, y_train, y_test = split_data(df)
    X_train_scaled, X_test_scaled = scale_data(X_train, X_test)

    model_results = evaluate_models(X_train_scaled, y_train, X_test_scaled, y_test)
    print(model_results)

    best_model = hyperparameter_tuning(X_train_scaled, y_train)

    # LSTM
    df['date_time_str'] = df.apply(lambda x: f"{int(x['MO'])}/{int(x['DY'])}/{int(x['YEAR'])} {int(x['HR'])}:00:00", axis=1)
    df['date_time'] = pd.to_datetime(df['date_time_str'], format="%m/%d/%Y %H:%M:%S")
    df = df.drop(['date_time_str'], axis=1)

    training_data_len = int(np.ceil(len(df) * .95))
    x_train, y_train, scaled_data = prepare_lstm_data(df, training_data_len)

    # Build and train LSTM model
    lstm_model = build_lstm_model((x_train.shape[1], 7))
    history = lstm_model.fit(x_train, y_train, batch_size=32, epochs=32, validation_split=0.15, verbose=1)

    plot_training_loss(history)

    # Predictions
    test_data = scaled_data[training_data_len - 120:, :]
    x_test = []
    
    for i in range(120, len(test_data)):
        x_test.append(test_data[i-120:i, :-1])
    
    x_test = np.array(x_test)
    lstm_predictions = lstm_model.predict(x_test)
    lstm_predictions = MinMaxScaler().fit(dataset).inverse_transform(lstm_predictions)
    
    return lstm_predictions

if __name__ == '__main__':
    file_path = r'C:\Users\HP\OneDrive\Desktop\gfg2\Solar-Panel-Optimization\solar_data.csv'
    main(file_path)
