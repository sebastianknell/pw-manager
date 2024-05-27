docker build -t pw-manager .
docker tag pw-manager us-central1-docker.pkg.dev/pw-manager-424216/main/pw-manager
docker push us-central1-docker.pkg.dev/pw-manager-424216/main/pw-manager
gcloud run deploy \
    --image us-central1-docker.pkg.dev/pw-manager-424216/main/pw-manager \
    --port 3000 \
    --add-cloudsql-instances pw-manager-424216:us-central1:pw-manager-db \
    --allow-unauthenticated \
    pw-manager