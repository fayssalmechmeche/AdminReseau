# Projet Docker Multi-Services

Ce projet configure plusieurs services Docker pour créer un environnement complet comprenant une base de données PostgreSQL, une interface d'administration, une application Node.js, un serveur Nginx, un partage Samba, un renouvellement automatique de certificats SSL via Certbot, et une protection contre les attaques avec Fail2ban.

## Structure des Services

### PostgreSQL

- **Image**: `postgres:16`
- **Ports**: `5432`
- **Variables d'environnement**:
  - `POSTGRES_USER`: root
  - `POSTGRES_PASSWORD`: root
  - `POSTGRES_DB`: app
- **Volumes**:
  - `./postgres/users.sql:/docker-entrypoint-initdb.d/users.sql`

### Adminer

- **Image**: `adminer:4.8.1`
- **Ports**: `8082:8080`
- **Dépend de**: `postgres`

### Node.js

- **Image**: `node:20`
- **Working Directory**: `/home/node/app`
- **Volumes**:
  - `./node:/home/node/app`
- **Ports**: `8081:8081`
- **Commande**: `bash -c "npm install && npm start"`
- **Variables d'environnement**:
  - `PGUSER`: root
  - `PGPASSWORD`: root
  - `PGHOST`: postgres
  - `PGDATABASE`: app
  - `PGPORT`: 5432
- **Dépend de**: `postgres`

### Nginx

- **Image**: `nginx:1.26.0`
- **Ports**:
  - `80:80`
  - `443:443`
- **Volumes**:
  - `./nginx/default.conf:/etc/nginx/conf.d/default.conf`
  - `./nginx/html:/usr/share/nginx/html`
  - `./nginx/certs:/etc/nginx/certs`
  - `./nginx/logs:/var/log/nginx`
- **Dépend de**: `node`

### Samba

- **Image**: `dperson/samba`
- **Ports**:
  - `139:139`
  - `445:445`
- **Volumes**:
  - `./samba:/mount`
- **Commande**: `-p`
- **Variables d'environnement**:
  - `USER`: `app;app`
  - `SHARE`: `app;/mount;yes;no;no;app;none`

### Certbot

- **Image**: `certbot/certbot`
- **Dépend de**: `nginx`
- **Volumes**:
  - `./nginx/certs:/etc/letsencrypt`
- **Entrypoint**: `/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'`

### Fail2ban

- **Image**: `lscr.io/linuxserver/fail2ban:latest`
- **Container Name**: `fail2ban`
- **Capacités ajoutées**:
  - `NET_ADMIN`
  - `NET_RAW`
- **Network Mode**: `host`
- **Variables d'environnement**:
  - `PUID`: 1000
  - `PGID`: 1000
  - `TZ`: Etc/UTC
- **Volumes**:
  - `./fail2ban/config:/config`
  - `/var/log:/var/log:ro`
  - `./nginx/logs:/remotelogs/nginx:ro`
- **Restart Policy**: `unless-stopped`

## Installation

1. Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine.
2. Clonez le dépôt de ce projet.
3. Placez vos fichiers de configuration dans les répertoires appropriés (`./postgres`, `./nginx`, `./samba`, etc.).
4. Lancez les services avec la commande suivante :

    ```sh
    docker-compose up -d
    ```

## Accès aux Services

- **Adminer**: `http://localhost:8082`
- **Application Node.js**: `http://localhost:8081`
- **Nginx**: `http://localhost` ou `https://localhost` pour les connexions sécurisées.
- **Samba**: Connectez-vous via un client Samba à `smb://localhost`.
- **Fail2ban**: Les journaux sont disponibles dans `./nginx/logs`.

## Notes

- Assurez-vous que les ports 80, 443, 139, 445, 8081, et 8082 sont libres sur votre machine hôte.
- Vous pouvez personnaliser les variables d'environnement et les volumes selon vos besoins.
- Pour les certificats SSL, Certbot est configuré pour renouveler automatiquement les certificats toutes les 12 heures.

## Contributions

Les contributions sont les bienvenues. Veuillez soumettre une pull request ou ouvrir une issue pour toute suggestion ou bug.


