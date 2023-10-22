import cv2
from scipy.interpolate import griddata
from matplotlib import pyplot as plt
import numpy as np


def azimuthalAverage(image, center=None):
    """
    Calculate the azimuthally averaged radial profile.
    (from https://www.astrobetter.com/blog/2010/03/03/fourier-transforms-of-images-in-python/)

    image - The 2D image
    center - The [x,y] pixel coordinates used as the center. The default is 
             None, which then uses the center of the image (including 
             fracitonal pixels).
    """
    # Calculate the indices from the image
    y, x = np.indices(image.shape)

    if not center:
        center = np.array([(x.max() - x.min()) / 2.0, (y.max() - y.min()) / 2.0])

    r = np.hypot(x - center[0], y - center[1])

    # Get sorted radii
    ind = np.argsort(r.flat)
    r_sorted = r.flat[ind]
    i_sorted = image.flat[ind]

    # Get the integer part of the radii (bin size = 1)
    r_int = r_sorted.astype(int)

    # Find all pixels that fall within each radial bin.
    deltar = r_int[1:] - r_int[:-1]  # Assumes all radii represented
    rind = np.where(deltar)[0]       # location of changed radius
    nr = rind[1:] - rind[:-1]        # number of radius bin

    # Cumulative sum to figure out sums for each radius bin
    csim = np.cumsum(i_sorted, dtype=float)
    tbin = csim[rind[1:]] - csim[rind[:-1]]

    radial_prof = tbin / nr

    return radial_prof


# def RGB2gray(rgb):
#     r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
#     gray = 0.2989 * r + 0.5870 * g + 0.1140 * b
#     return gray


if __name__ == '__main__':
    import glob

    epsilon = 1e-8
    DSIZE = 224
    N = 156
    max_number_iter = 1000

    # visual - real
    cont = 0
    real_total = np.zeros([max_number_iter, N])
    real_org_mean = np.zeros(N)
    real_org_std = np.zeros(N)
    for filename in glob.glob('./real/' + "*.jpg"):
        # Read image
        img = cv2.imread(filename, 0)  # Grayscale
        img = cv2.resize(img, dsize=(DSIZE, DSIZE), interpolation=cv2.INTER_AREA)

        f = np.fft.fft2(img)
        fshift = np.fft.fftshift(f)
        fshift += epsilon

        magnitude_spectrum = 20 * np.log(np.abs(fshift))

        # Calculate the azimuthally averaged 1D power spectrum
        psd1D = azimuthalAverage(magnitude_spectrum)
        #
        psd1D = (psd1D - np.min(psd1D)) / (np.max(psd1D) - np.min(psd1D))
        real_total[cont, :] = psd1D
        # Calculate the azimuthally averaged 1D power spectrum
        # points = np.linspace(0, N, num=psd1D.size)  # coordinates of a
        # xi = np.linspace(0, N, num=N)  # coordinates for interpolation
        # interpolated = griddata(points, psd1D, xi, method='cubic')
        # interpolated = (interpolated - np.min(interpolated)) / (np.max(interpolated) - np.min(interpolated))
        # real_total[cont, :] = interpolated

        cont += 1
        if cont == max_number_iter:
            break
    for x in range(N):
        real_org_mean[x] = np.mean(real_total[:, x])
        real_org_std[x] = np.std(real_total[:, x])

    # visual - fake
    cont = 0
    fake_total = np.zeros([max_number_iter, N])
    fake_org_mean = np.zeros(N)
    fake_org_std = np.zeros(N)
    for filename in glob.glob('./fake/' + "*.jpg"):
        # Read image
        img = cv2.imread(filename, 0)  # Grayscale
        img = cv2.resize(img, dsize=(DSIZE, DSIZE), interpolation=cv2.INTER_AREA)

        f = np.fft.fft2(img)
        fshift = np.fft.fftshift(f)
        fshift += epsilon

        magnitude_spectrum = 20 * np.log(np.abs(fshift))

        # Calculate the azimuthally averaged 1D power spectrum
        psd1D = azimuthalAverage(magnitude_spectrum)
        #
        psd1D = (psd1D - np.min(psd1D)) / (np.max(psd1D) - np.min(psd1D))
        fake_total[cont, :] = psd1D
        # Calculate the azimuthally averaged 1D power spectrum
        # points = np.linspace(0, N, num=psd1D.size)  # coordinates of a
        # xi = np.linspace(0, N, num=N)  # coordinates for interpolation
        # interpolated = griddata(points, psd1D, xi, method='cubic')
        # interpolated = (interpolated - np.min(interpolated)) / (np.max(interpolated) - np.min(interpolated))
        # fake_total[cont, :] = interpolated

        cont += 1
        if cont == max_number_iter:
            break
    for x in range(N):
        fake_org_mean[x] = np.mean(fake_total[:, x])
        fake_org_std[x] = np.std(fake_total[:, x])

    # # show
    # # print(len(real_total[0]), len(real_total))
    # # print(len(fake_total[0]), len(fake_total))

    # y = []
    # error = []

    # y.append(real_org_mean)
    # error.append(real_org_std)
    # y.append(fake_org_mean)
    # error.append(fake_org_std)

    # x = np.arange(0, N, 1)
    # fig, ax = plt.subplots(figsize=(15, 9))
    # ax.plot(x, y[0], alpha=0.5, color='red', label='real', linewidth=2.0)
    # ax.fill_between(x, y[0] - error[0], y[0] + error[0], color='red', alpha=0.2)
    # ax.plot(x, y[1], alpha=0.5, color='blue', label='fake', linewidth=2.0)
    # ax.fill_between(x, y[1] - error[1], y[1] + error[1], color='blue', alpha=0.2)

    # plt.xlabel('Spatial Frequency', fontsize=25)
    # plt.ylabel('Power Spectrum', fontsize=25)
    # plt.tick_params(axis='x', labelsize=20)
    # plt.tick_params(axis='y', labelsize=20)

    # ax.legend(loc='best', prop={'size': 25})

    # plt.show()

    # classification
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.svm import SVC
    from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
    from joblib import dump, load
    import os

    data = np.vstack((real_total, fake_total))
    labels = ['real'] * real_total.shape[0] + ['fake'] * fake_total.shape[0]

    # Split the dataset into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(data, labels, test_size=0.3, random_state=42)

    # Standardize the feature data
    scaler_filename = 'standard_scaler.joblib'
    if os.path.exists(scaler_filename):
        sc = load(scaler_filename)
        X_train = sc.transform(X_train)
        X_test = sc.transform(X_test)
    else:
        sc = StandardScaler()
        X_train = sc.fit_transform(X_train)
        dump(sc, scaler_filename)  # Save
        X_test = sc.transform(X_test)

    # Check if SVM model exists; if not, train a new one
    model_filename = 'svm_classifier.joblib'
    if os.path.exists(model_filename):
        clf = load(model_filename)
    else:
        clf = SVC(kernel='rbf', random_state=42)
        clf.fit(X_train, y_train)  # Train
        dump(clf, model_filename)  # Save

    # Evaluate the classifier's performance
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))
    print("\nConfusion Matrix:\n", confusion_matrix(y_test, y_pred))
