import random, string, re, hashlib
from collections import Counter
from datetime import datetime
from django.db import models
from authentication.models import CustomUser
from bs4 import BeautifulSoup
import random
import string
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup

# Fonction pour générer un code court intelligent basé sur l'URL
def generate_smart_short_code(url):
    # Extraction du domaine principal de l'URL
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.split('.')[0]  # Par exemple, 'example' de 'example.com'
    
    # Essayer de récupérer le titre de la page web
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string.strip() if soup.title else ""
        
        # Si un titre est trouvé, on utilise les premiers mots du titre
        if title:
            title_words = title.split()
            short_code = "".join([word[:3] for word in title_words[:3]])  # Utiliser les 3 premiers mots du titre
            return short_code.lower()
    except Exception as e:
        print(f"Error fetching title: {e}")

    # Si aucun titre n'est trouvé ou erreur, on se base sur le domaine
    short_code = domain[:6]  # Utiliser les 6 premiers caractères du domaine
    
    # Si le code court est trop court, on le complète avec des caractères aléatoires
    if len(short_code) < 6:
        short_code += ''.join(random.choices(string.ascii_letters + string.digits, k=6-len(short_code)))
    
    return short_code.lower()

class ShortenedUrl(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    original_url = models.URLField()
    title = models.CharField(max_length=50, blank=True, null=True)
    short_code = models.CharField(max_length=10, blank=True)  # Plus flexible
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.short_code:
            self.short_code = generate_smart_short_code(self.original_url)
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.short_code} for {self.original_url}'


