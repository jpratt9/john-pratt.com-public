---
title: 5 things I wish somebody told me when I started writing production code
description:
date: '2025-06-07'
draft: false
slug: '/blog/5-things-i-wish'
tags:
  - dev tips
  - software dev
  - sde
---

1) Ship broken code, but hide it behind a feature flag. It's how you move fast *without* breaking things.

2) Logs aren't optional. Without them you're flying blind.

3) In production, every external API will flake on you. Wrap it in a timeout, a rescue, and a log.

4) Don't hard code things that will change like URL's or limits. Put it in an environment variable.

5) Figure out how to tell your code is working in production before you launch. Set up alerts, logs and dashboards.

Save this for later and send it to the new dev on your team.