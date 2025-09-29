# Urlshortener - Backend

## Prérequis

* [Docker](https://www.docker.com/).
* [uv](https://docs.astral.sh/uv/) pour la gestion des paquets Python et des environnements virtuels.

## Docker Compose

Après la mise en place de la bdd locale, lancez l’environnement de développement local avec Docker Compose:

``` bash 
    docker compose up
```

## Flux de travail général

Par défaut, les dépendances sont gérées avec [uv](https://docs.astral.sh/uv/). Installez-le si ce n’est pas déjà fait.

Depuis le dossier `./backend/`, installez toutes les dépendances avec :

```console
$ uv sync
```

Activez ensuite l’environnement virtuel avec :

```console
$ source .venv/bin/activate
```

Assurez-vous que votre éditeur utilise le bon interpréteur Python situé dans `backend/.venv/bin/python`.
