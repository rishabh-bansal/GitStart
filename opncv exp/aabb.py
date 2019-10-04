import cv2
import numpy as np
img = cv2.imread('c.jpg', -1)

img = cv2.line(img, (0,0), (200,200), (0,0,255), 5 )
img =  cv2.arrowedLine(img, (0,255), (200,200), (0,0,255), 5 )

print(img)

cv2.imshow('image', img)
k = cv2.waitKey(0)
if(k == 27):
    cv2.destroyAllWindows()
elif(k == ord('f')):
    cv2.imwrite('cool.png', img)
