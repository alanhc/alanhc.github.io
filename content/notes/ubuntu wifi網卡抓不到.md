---
title: ubuntu wifi網卡抓不到
date: 2024-10-11
tags:
  - driver
updated: 2024-10-11
up:
aliases:
  - /blog/ubuntu-wifi%E7%B6%B2%E5%8D%A1%E6%8A%93%E4%B8%8D%E5%88%B0/
---

## Ref

lsusb
![](https://i.imgur.com/SRI6jmT.png)
RTL8821AU
https://github.com/brektrou/rtl8821CU

找到對應的git
https://github.com/gnab/rtl8812au
make
sudo make install



## TX20U 在Ubuntu 22.04
https://www.tp-link.com/tw/support/faq/3423/
看到他是 Realtek 8832AU
![](https://i.imgur.com/8YuZ7x7.png)

https://github.com/hyekalhitech/ArcherRTL8832AU
