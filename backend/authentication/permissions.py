from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Permission pour vérifier si l'utilisateur est un administrateur.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_staff

class IsReadOnlyOrAdmin(BasePermission):
    def has_permission(self, request, view):

        # Les utilisateurs authentifiés peuvent effectuer uniquement des requêtes GET
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        # Autoriser les autres méthodes uniquement pour les administrateurs
        return request.user and request.user.is_authenticated and request.user.is_staff
