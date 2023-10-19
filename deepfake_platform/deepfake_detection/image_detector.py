import cv2
import numpy as np
from joblib import load
import os

from .azimuthal import azimuthalAverage


def read_image(filepath):
    img = cv2.imread(filepath, 0)  # Grayscale
    img = refine_image(img)

    return img


def refine_image(img):
    DSIZE = 224

    img = cv2.resize(img, dsize=(DSIZE, DSIZE), interpolation=cv2.INTER_AREA)

    return img


def extract_features(img):
    epsilon = 1e-8

    f = np.fft.fft2(img)
    fshift = np.fft.fftshift(f)
    fshift += epsilon

    magnitude_spectrum = 20 * np.log(np.abs(fshift))

    # Calculate the azimuthally averaged 1D power spectrum
    psd1D = azimuthalAverage(magnitude_spectrum)
    #
    psd1D = (psd1D - np.min(psd1D)) / (np.max(psd1D) - np.min(psd1D))

    return psd1D


def classify_image(image):
    # Assuming extract_features is defined elsewhere or imported
    # def extract_features(image):
    #     ...  # Feature extraction logic
    #     return feature_vector

    # Load SVM and StandardScaler models
    svm_filename = 'svm_classifier.joblib'
    scaler_filename = 'standard_scaler.joblib'

    if not os.path.exists(svm_filename) or not os.path.exists(scaler_filename):
        raise ValueError("Model files not found!")

    clf = load(svm_filename)
    sc = load(scaler_filename)

    # Extract features from the image
    feature_vector = extract_features(image)

    # Standardize the feature vector
    feature_vector_scaled = sc.transform([feature_vector])

    # Predict using SVM
    prediction = clf.predict(feature_vector_scaled)

    # Return True for 'real' and False for 'fake'
    return prediction[0] == 'real'


if __name__ == '__main__':
    import glob
    for filename in glob.glob('./real/' + "*.jpg"):

        img = read_image(filename)
        print(classify_image(img))  # True for 'real', False for 'fake'
