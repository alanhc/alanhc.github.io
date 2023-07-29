---
title: 'k8s notes md'
date: '2022-12-31'
tag: ['notes', 'cloud']
---

# nextjs k8s notes

1. 新增 k8s/deploy.yml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: nextjs-app
  name: nextjs-app
spec:
  selector:
    matchLabels:
      app: nextjsapp
  template:
    metadata:
      labels:
        app: nextjsapp
    spec:
      containers:
      - name: app
        image: docker.io/alanhc/alanhc.github.io
        imagePullPolicy: Always
        ports:
          - containerPort: 3000
```

2. build image：`docker build . -t alanhc/alanhc.github.io:latest`

```dockerfile
FROM node:16-alpine

ARG NODE_ENV="production"

ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

ENV PORT=3000

EXPOSE 3000

CMD [ "yarn", "start" ]

```

3. 跑起來測試 `docker run -p 3000:3000 alanhc/alanhc.github.io`

4. 推上docker hub `docker push alanhc/alanhc.github.io`

5. k8s config:`kubectl apply -f k8s`

6. 在minikube使用portfoard啟動:`kubectl port-forward svc/nextjs-app 3000:3000`
