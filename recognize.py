import face_recognition
import sys
import glob
import numpy as np

try:
	current = face_recognition.load_image_file("tempImageHolder/"+sys.argv[1]+".jpg")
	path = "dataset/*.npy"
	i = 0
	for i in face_recognition.face_encodings(current):
		current_encoding = i;
		for fname in glob.glob(path):
			results = face_recognition.compare_faces([current_encoding], np.load(fname))
			if(results[0] == True):
				print(fname.split("/")[1].split(".")[0])
except:
    print (-1)
