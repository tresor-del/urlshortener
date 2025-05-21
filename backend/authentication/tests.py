from rest_framework.test import APITestCase
from django.urls import reverse
from .models import CustomUser

class RegisterTest(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
    
    def user_data(self):
        data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "strongpassword123",
            'is_staff': False
        }
        return data
    
    def invalid_user_data(self):
        data = {
            "username": "testuser",
            "email": "testuser@example.com",
            "password": "testuserpassword",
            'is_staff': False
        }
        return data
    

    def test_register_success(self):
        
        response = self.client.post(self.register_url, self.user_data())
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.data)
    
    def test_register_duplicated_email(self):
        
        # Premier enrégistrement
        self.client.post(self.register_url, self.user_data())

        # Tentative d'un second enrégistrement
        response = self.client.post(self.register_url, self.user_data())
        
        self.assertEqual(response.status_code, 400)
    
    def test_username_in_password(self):
        
        response = self.client.post(self.register_url, self.invalid_user_data())
        
        self.assertEqual(response.status_code, 400)

        
class UserManagementTest(APITestCase):

    def setUp(self):
        self.user_url = reverse('user_list_create')  

        # Créer un utilisateur admin
        self.admin = CustomUser.objects.create_user(username='admin', email='admin@gmail.com', password='adminstrongpassword', is_staff=True)
        
        # Créer un utilisateur non-admin
        self.user = CustomUser.objects.create_user(username='user', email='user@example.com', password='userpassword')

    def user_data(self):
        # Données de l'utilisateur que nous allons tester
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpassword123",
            'is_staff': False
        }
        return data
    
    def get_admin_user_token(self):
        # Obtenir un token d'authentification
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'admin', 'password': 'adminstrongpassword'})
        token = response.data['access']  # Récupérer le token d'accès

        # Utiliser le token pour s'authentifier dans les requêtes suivantes
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

    def test_create_user(self):
        self.get_admin_user_token()
        response = self.client.post(self.user_url, self.user_data(), format='json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.data)  # Si vous retournez un ID de l'utilisateur créé

    def test_list_user(self):
        self.get_admin_user_token()
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('username', response.data[0])  # Assurez-vous que la réponse contient des utilisateurs

    def test_delete_user(self):
        self.get_admin_user_token()
        delete_url = reverse('customuser-detail', kwargs={'pk': self.user.id})
        response = self.client.delete(delete_url)
        self.assertFalse(CustomUser.objects.filter(id=self.user.id).exists())

