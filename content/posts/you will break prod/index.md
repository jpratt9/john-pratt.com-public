---
title: You WILL break prod, unless...
description: a
date: '2025-06-06'
draft: false
slug: '/blog/breaking-prod'
tags:
  - data structures
  - algorithms
  - databases
  - data
---

You **WILL** break production Unless you know these 5 backend dev tips:

1) Don't run heavy or slow code in a web request, move it to a background job - otherwise requests start piling up and response times tank.
2) Train yourself to spot N + 1 queries. They're silent in dev, but under real traffic they hammer your database and kill your performance.
3) If you're running an expensive query repeatedly cache the response in an in memory data store like Redis or Memcached. It'll take the pressure off the database and speed up responses.
4) Know when to denormalize. If your data's read heavy, optimize for reads, not textbook normalization.
5) Make your database migrations reversible. If one of them goes wrong, you'll stall the deployment pipeline and scramble to recover.

Back end isn't just about writing code, it's about not breaking stuff.

![breaking prod](./breaking_prod.jpg)

[Follow](https://www.linkedin.com/in/john-pratt787) for more dev tips!
