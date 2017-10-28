from django.shortcuts import render , get_object_or_404
from .models import Album

def index(request):
    all_album=Album.objects.all()
    return render(request,'music/index.html',{'all_album':all_album})
def detail(request,album_id):
    album=get_object_or_404(Album,pk=album_id)
    return render(request,'music/detail.html',{'album':album})
