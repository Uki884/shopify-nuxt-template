shopify appsをdockerを使ってローカル環境で開発できるようにする

# Setup

## 環境変数設定

```.env
DB_NAME=shopify_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=db
DB_PORT=5432
APP_DOMAIN=localhost
HOST=https://localhost
APP_STAGE=local
SHOPIFY_API_KEY= //アプリのAPI_KEY
SHOPIFY_API_SECRET= //アプリのSECRET_KEY
SHOP= //shopドメイン
SCOPES=read_themes,write_themes,write_products,write_customers,write_orders,write_draft_orders,read_orders,read_fulfillments,write_fulfillments,read_script_tags,write_script_tags
```

## docker立ち上げ
```
docker-compose up -d
```

## chromeでlocalhostでもhttpsを使えるようにする

```
chrome://flags/#allow-insecure-localhost
```

## dbモデル作成
```
docker-compose exec app npm run sequelize model:create --name ${テーブル名} --underscored --attributes ${カラム名}:${型}

例: docker-compose exec app npm run sequelize model:create --name movie --underscored --attributes title:string,video_id:string,tag:integer,upload_date:date,is_delete:boolean
```

