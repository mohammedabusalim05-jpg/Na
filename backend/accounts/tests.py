from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

class GuestViewTests(TestCase):
    def test_guest_view_returns_token(self):
        client = APIClient()
        # The url name is 'guest' in accounts/urls.py, but it is included under 'api/accounts/'
        # Note: reverse names are usually local unless namespaces are used. 
        # accounts/urls.py does not define an app_name.
        # So it should be just 'guest' ?
        # Or maybe I should use the path directly if reverse is tricky.
        # Let's try reverse first. If namespace is not set, 'guest' should work.
        url = reverse('guest')  
        response = client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('expires_in', response.data)
