from rest_framework.test import APITestCase
from django.urls import reverse
from .models import CustomUser

class RegisterTest(APITestCase):
    def setUp(self):
        self.register_url = reverse('register')
    
    def user_data(self):
        data = {
            "email": "testuser1@example.com",
            "password": "strongpassword123",
            'is_staff': False
        }
        return data
    
    def invalid_user_data(self):
        data = {
            "email": "testuser2@example.com",
            "password": "testuser2password",
            'is_staff': False
        }
        return data
    

    def test_register_success(self):
        
        response = self.client.post(self.register_url, self.user_data())
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.data)

    
    def test_register_duplicated_email(self):

        # first registration
        self.client.post(self.register_url, self.user_data())

        # second registration
        response = self.client.post(self.register_url, self.user_data())
        
        self.assertEqual(response.status_code, 400) # 400 invalid request
    
    # def test_username_in_password(self):
    #     response = self.client.post(self.register_url, self.invalid_user_data())
    #     self.assertEqual(response.status_code, 400)

        
class UserManagementTest(APITestCase):

    def setUp(self):
        self.user_url = reverse('user_list_create')  

        # create an admin user
        self.admin = CustomUser.objects.create_user(username='admin', email='admin@gmail.com', password='adminstrongpassword', is_staff=True)
        
        # create a random user
        self.user = CustomUser.objects.create_user(username='user', email='user@example.com', password='userpassword')

    def user_data(self):
        data = {
            "email": "newuser@example.com",
            "password": "newpassword123",
            'is_staff': False
        }
        return data
    
    def get_admin_user_token(self):
        # Obtenir un token d'authentification
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'admin', 'password': 'adminstrongpassword'})
        token = response.data['access'] 
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token) # space after bearer is important
    
    def test_get_admin_user_token(self):
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'admin', 'password': 'adminstrongpassword'})
        self.assertIn('access', response.data)
        self.assertTrue(self.admin.is_staff)


    def test_create_user(self):
        self.get_admin_user_token()
        response = self.client.post(self.user_url, self.user_data(), format='json')
        # print(response.data)
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.data)  

    def test_list_user(self):
        self.get_admin_user_token()
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('username', response.data[0]) 

    def test_delete_user(self):
        self.get_admin_user_token()
        delete_url = reverse('customuser-detail', kwargs={'pk': self.user.id}) # 
        response = self.client.delete(delete_url)
        self.assertFalse(CustomUser.objects.filter(id=self.user.id).exists())

