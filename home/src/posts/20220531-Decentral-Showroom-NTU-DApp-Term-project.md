---
title: Decentral Showroom — NTU DApp Term project
date: 2022-05-31
tags:
  - medium
---

![](https://i.imgur.com/arbyM3t.png)

photo by Hsiang Hsu, model: Cute Ubi

> Decentral Showroom，屬於你的Metaverse展場空間

期末我和實驗室同學Leo Chen、Jack Hsieh、Hsiang Hsu及Ubi Tsai製作了 一個基於Tezos鍊上的NFT展場空間，拉近您與作品的距離，先來看我們做了甚麼👉 \[65s\]
<iframe width="560" height="315" src="https://www.youtube.com/embed/7EPRiUR4XqM?si=TMoOaO0D2IYcqrId" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
策展
==

策展人可以透過 [DSR網站](https://dsr-team.github.io/DSR-Editor)，建立您的展場空間，並透過編輯器擺放您所擁有的NFT(non fungible tokens)，展場建立後會產生一個可以被分享的Id。

![](https://i.imgur.com/AcvD0ul.png)

DSR Editor: [https://dsr-team.github.io/DSR-Editor](https://dsr-team.github.io/DSR-Editor)

使用VR與NFT作品互動
============

戴上頭盔、輸入展場ID即可進入沈浸式的虛擬展間體驗各式各樣的作品，DSR支援的作品類型包含聲音、影片、模型及GIF，您可以在DSR的元宇宙裡與作品近距離互動，更可以將模型直接拿下來仔細研究不必擔心會損壞作品。

![](https://i.imgur.com/FZu6uJ3.png)
進入DSR虛擬展間

![](https://i.imgur.com/nDxWrKx.png)

將3D作品拿下來觀看

系統設計
====

DSR系統分為三個部分，VR互動、前端Editor及後端的API services，我們使用FARM(FastAPI, React, MongoDB)的技術來完成此系統。

![](https://i.imgur.com/nDQb77k.png)

系統架構圖

DSR Showroom
============

在VR沈浸式展場中，模擬美術館、博物館呈現作品的方式來擺放NFT作品，支援teleport、snapturn等操作功能。為了避免不同作品的聲音干擾影響觀展體驗，DSR設計了“作品泡泡”讓您可以安心的體驗作品不被干擾。


![](https://i.imgur.com/KnjWQOd.png)

DSR 展場空間

DSR Editor
==========

策展人首先必須簽署一個payload用於登入，並回傳server取得登入憑證。

![](https://i.imgur.com/93qMrVG.png)


簽署登入payload

使用DSR Editor可以建立虛擬展間，建立完成後會取得展間ID。

![](https://i.imgur.com/5bIuuiE.png)


建立虛擬展場

接下來就是佈置您的展場了～～

![](https://i.imgur.com/46zFrAj.png)


擺設NFT

> 以下內容部分與web3的驗證機制有關，推薦先閱讀下列文章。

[

web3 世界裡的驗證機制，以Tezos為例
----------------------

### 在web3的世界裡面，區塊鏈錢包取代了過去綁定社交帳號登入的功能，以下面在Tezos上的NFT交易平台objkt為例，可以看到sync取代login的按鈕。

medium.com

](https://medium.com/@alanhc/web3-世界裡的驗證機制-5e0d05b6f735?source=post_page-----ce947ea9c792--------------------------------)

DSR Service
===========

DSR Service有三個部分，Authorization service、Room Service及Data Service。

Authorization service
---------------------

client會先傳送登入請求給Auth service，此服務使用數位簽章的方式確認client傳來的signature並頒發用於登入的JWT。

Room service
------------

Room service提供建立虛擬展間的功能，包含了基本的mongoDB CRUD(Create, Read, Update, Delete)讓DSR Editor及DSR Showroom讀寫房間資訊。

Data Service
============

Data Service提供了NFT metadata的查詢功能，因目前只有支援Tezos鏈，使用了[Akaswap API](https://api.akaswap.com/v2/doc/index.html) 用於查詢Tezos鏈上的NFT Metadata。

![](https://i.imgur.com/BYQ1deJ.png)


DSR service
![](https://i.imgur.com/PSynLhq.png)

DSR Service entrypoint

快來[下載](https://github.com/DSR-Team/DSR-Project)使用吧～～

相關鏈結
====
*   DSR Showroom：[https://github.com/DSR-Team/DSR-Project](https://github.com/DSR-Team/DSR-Project)
*   DSR開源程式：[https://github.com/DSR-Team](https://github.com/DSR-Team)
*   [web3的登入驗證機制](https://medium.com/@alanhc/web3-世界裡的驗證機制-5e0d05b6f735)

![](https://i.imgur.com/wHJ4hlk.png)

## Ref
- https://medium.com/@alanhc/decentral-showroom-ntu-dapp-term-project-ce947ea9c792
