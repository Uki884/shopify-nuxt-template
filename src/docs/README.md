# shopify-nuxt-koa

## Development

### Prerequisites

- [Node.js](https://nodejs.org/)
  - v10 以降で動作。v12 推奨。
- [Yarn](https://classic.yarnpkg.com/)
  - 1.x 系でのみ動作確認済み。
- [Shopify App CLI](https://github.com/Shopify/shopify-app-cli)
- ストアとアプリの作成
  - https://partners.shopify.com/organizations
  - ストアの作成は「ストア管理」メニューから、アプリの作成は「アプリ管理」メニューから可能。

### Setup

ソースコードを取得し、依存パッケージのインストールを行う。

```bash
# clone repository
$ git clone <url of repository>
$ cd path/to/repository

# install dependencies
$ yarn install
```

/etc/hosts に 1 行追記。Shopify APP CLI の動作のため。

```
127.0.0.1   app-cli-loopback.shopifyapps.com
```

初回起動。

```bash
# .env削除
$ rm .env

# .env自動生成
$ shopify serve
? What is your Shopify API key?
> 5e9f9ae528fc271b8331a1155357d5c8 # ← APIキーを入力
? What is your Shopify API secret key?
> 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 # ← APIシークレットキーを入力
? What is your development store URL? (e.g. my-test-shop.myshopify.com)
> tabira-dev.myshopify.com # ← アプリをインストールしてテストする開発ストアURLを入力
✓ ngrok tunnel running at https://8bc6b59c.ngrok.io
✓ .env saved to project root
✓ ngrok tunnel running at https://8bc6b59c.ngrok.io
✓ .env saved to project root
? Do you want to update your application url? (Choose with ↑ ↓ ⏎)
> 1. yes # ← yesを選択
  2. no
✓ Whitelist URLS updated in Partners Dashboard
⭑ Press  Control-T to open this project in tabira-dev.myshopify.com
┏━━ Running server... ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
...(snip)...
┃  READY  Server listening on http://0.0.0.0:8081
┃
...(Ctrl+C)...

# .envのSCOPESを書き換え
$ vim .env
$ grep SCOPES .env
SCOPES=read_products,write_products,read_customers,write_customers,read_orders,write_orders,read_draft_orders,write_draft_orders
```

開発ストアにアプリをインストール。  
"yes"を選択すると、ブラウザがアプリインストール画面を開き、「未掲載のアプリをインストールする」を押すとインストールが完了する。

```
$ shopify authenticate shop
? Open default browser to authenticate with the Partner Dashboard? (Choose with ↑ ↓ ⏎)
> 1. yes # ← yesを選択
  2. no
```

![Shopify App Installation](./images/shopify-app-installation.png)

!> インストール完了後にエラー画面が表示されることがある。問題ないためタブを閉じる。

### Run

shopify コマンドでアプリを起動しておく。コードを書き換えると hot reload される。

```bash
$ shopify serve
Updating shopify-cli...done!
✓ ngrok tunnel running at https://ba1dbe0d.ngrok.io
✓ .env saved to project root
✓ Whitelist URLS updated in Partners Dashboard
⭑ Press  Control-T to open this project in tabira-dev.myshopify.com
┏━━ Running server... ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃
...(snip)...
┃
┃  READY  Server listening on http://0.0.0.0:8081
┃
```

!> 何らかの問題が発生した場合は[こちら](?id=shopify-app-cli)。

### Documentation

このドキュメントは [docsify](https://docsify.js.org/) で記述されている。
以下のコマンドでサーバが起動し、 http://localhost:3000 でドキュメントを閲覧することが可能。

```bash
$ npx docsify serve docs
```

## Memo

### 実装

プロジェクトは `yarn create nuxt-app` で生成。

#### 依存パッケージ

- `@shopify/koa-shopify-auth`
  - Shopify の OAuth 実装のパッケージ。
  - `shopifyAuth` 関数で、OAuth のための middleware が生成される。
  - `verifyRequest` 関数で、セッションに格納されているアクセストークンの有効性確認を行う middleware が生成される。有効でなかった場合には再認証する。
- `koa-session`
  - Koa でセッションを扱うためのパッケージ。
  - Cookie に暗号化したセッションデータを書いている。暗号鍵は `app.keys = ...` で設定。
- `@koa/router`
  - ルーティングを Express に近い書き方で行うためのパッケージ。
- `isomorphic-fetch`
  - Fetch API を利用するためのパッケージ。

#### 処理の流れ

最初に実行されるのは server/index.js 。処理の大まかな流れは以下の通り。

1. Koa インスタンスの生成。
2. nuxt.config.js の読み込み。
3. OAuth 関連処理を Koa に登録（setupShopifyAuth 関数）。
4. Nuxt 外で処理させたいものを Koa に登録（setupRoutes 関数）。
5. Nuxt を Koa に登録。
6. サーバ起動。

#### Shopify Admin API の呼び出し方

https://shopify.dev/docs/admin-api

※ 本リポジトリでは REST API を利用。

API コール時には、`X-Shopify-Access-Token` ヘッダにアクセストークンをつけてリクエストを送る。それ以外のパラメータについては各 API のドキュメントに従う。

各 API は、事前に認可を受けたものしか利用できない。
[Admin API access scopes](https://shopify.dev/docs/admin-api/access-scopes)に従い、必要なスコープを .env ファイル内の SCOPES に記述する。
記述を変更した場合には再度認可のフローをやり直す必要がある。

### Shopify App CLI

https://github.com/Shopify/shopify-app-cli

#### ngrok でエラーが発生した場合

URL の有効期限切れやリクエスト数の制限値超えにより、ngrok でエラーが生じることがある。  
その場合には ngrok を再起動する。再起動には shopify コマンドを利用すると便利。

```bash
# ngrokの終了
$ shopify tunnel stop
Updating shopify-cli...done!
x ngrok tunnel stopped

# アプリ起動(ngrokも同時に起動される)
$ shopify serve
...(snip)...
```

#### テスト用データの生成

```bash
# 商品の作成
$ shopify populate products
✓ billowing shape added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/products/4659748438147
✓ wispy paper added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/products/4659748470915
✓ weathered hill added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/products/4659748536451
✓ lingering lake added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/products/4659748601987
✓ blue glade added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/products/4659748667523
Successfully added 5 products to tabira-dev.myshopify.com
⭑ View all products at https://tabira-dev.myshopify.com/admin/products

# 顧客の作成
$ shopify populate customers
✓ snowflake weathered added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/customers/3089832378499
✓ smoke quiet added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/customers/3089832575107
✓ cherry lively added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/customers/3089832706179
✓ firefly rough added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/customers/3089832902787
✓ dawn empty added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/customers/3089833132163
Successfully added 5 customers to tabira-dev.myshopify.com
⭑ View all customers at https://tabira-dev.myshopify.com/admin/customers

# 下書き注文の作成
$ shopify populate draftorders
✓ DraftOrders added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/draft_orders/536620925059
✓ DraftOrders added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/draft_orders/536620957827
✓ DraftOrders added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/draft_orders/536620990595
✓ DraftOrders added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/draft_orders/536621023363
✓ DraftOrders added to tabira-dev.myshopify.com at https://tabira-dev.myshopify.com/admin/draft_orders/536621056131
Successfully added 5 draftorders to tabira-dev.myshopify.com
⭑ View all draftorders at https://tabira-dev.myshopify.com/admin/draftorders
```

?> `--count` オプションで個数指定が可能。

### その他

- アプリ設定の「アプリ URL」と「ホワイトリストに登録されたリダイレクト URL」は shopify コマンドによって自動で更新されるが、「ホワイトリストに登録されたリダイレクト URL」は追記されていくためどんどん大きくなる。時々ゴミ掃除をするのが望ましい。その際、 `app-cli-loopback.shopifyapps.com:3456` を削除しないこと。
