import face_recognition
import sys
import numpy as np

current = face_recognition.load_image_file("public/images/"+sys.argv[1]+".jpg")
current_encoding = face_recognition.face_encodings(current)[0]

np.save("dataset/"+sys.argv[2], current_encoding)