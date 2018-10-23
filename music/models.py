from django.db import models

class Album(models.Model):
    artist=models.CharField(max_length=100)
    title=models.CharField(max_length=100)
    genre=models.CharField(max_length=50)

    def __str__(self):
        return self.artist + '-' + self.title

class song(models.Model):
    album=models.ForeignKey(Album,on_delete=models.CASCADE)
    file_type=models.CharField(max_length=10)
    song_title=models.CharField(max_length=50)

    def __str__(self):
        return self.song_title 
