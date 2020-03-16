
# tutorial: deploy your microservices to azure with kubernetes

objectives
- deploy dockerized microservices to azure using kubernetes and helm
- your own domain name, and each microservice has its own subdomain
- tls/https to secure all inbound connections
- static ip addresses for ingress/egress for stable dns records and whitelisting

prerequisites to install on your dev machine:
- docker
- kubernetes
- helm
- azure command line tool, and login with `az login`

## create a helm chart and test your app locally

1. install and start minikube
	- *coming soon*
1. create helm repo, setup templates, values, and config secrets
	- *coming soon*
1. deploy on minikube and test
	- *coming soon*

## provision an azure kubernetes cluster

&nbsp; **(a) create cluster in azure portal**
1. start at the [azure portal home](https://portal.azure.com/)
1. create a resource group
	- give it a unique name, i chose `workgroup`
	- choose a location, i chose `uswest`
	- azure's ui takes awhile to reflect adding or deleting resources or group, hang in there
1. create the "Kubernetes Service" cluster resource
	- create new resource, search "kubernetes" in the marketplace
	- assign it to your resource group
	- assign a unique name for your kubernetes cluster, i chose `workback`
	- assign the same region as the resource group, `uswest` for me
	- choose the kubernetes version, i chose `1.17.0 (preview)`
	- i left the default dns name prefix, `workback-dns`
	- i chose the smallest node available, `Standard B2s`, 4gb ram, 2vcpus
	- i set node count down to `1`
	- disable `RBAC` in the "authentication" tab
	- disable `HTTP application routing` in the "networking" tab
	- i left everything else default, and hit "create"
	- have a coffee while it boots up the cluster
1. connect your `kubectl` to the cluster with the azure cli
	- of course, replace the resource group and cluster names in comands like these
	```sh
	az aks get-credentials --resource-group workgroup --name workback
	```

&nbsp; **(b) configure static ip's and link your domain**
1. find your existing static ip for egress: azure automatically makes one for your cluster and it's ready
	- back at the [azure portal home](https://portal.azure.com/), search for "public ip addresses" to find the resource category
	- you should see a static ip listing that was created automatically for your cluster
	- this is the ip your cluster will use when making connections to outside the cluster
	- take note of this ip address value, mine was `13.86.244.186`
	- whitelist this address in your database cluster or similar
1. create a new static ip for ingress
	- first, you need to get the "full" group name
		```sh
		az aks show --resource-group workgroup --name workback --query nodeResourceGroup -o tsv
		```
		- it gave me `MC_workgroup_workback_westus`
	- now create the static ip, but use the name returned by the above command
		```sh
		az network public-ip create \
			--name workback-ingress-ip \
			--resource-group MC_workgroup_workback_westus \
			--sku Standard \
			--allocation-method static
		```
		- i made up the name `workback-ingress-ip`
		- take note of the ipAddress in the json it returns, i got `13.83.71.184`
1. set `A` records on your domain pointing to the ingress ip
	- login to your registrar and go into your domain's dns settings
	- set `A` records pointing to your static ingress ip for all domains and subdomains, for example i set:
		- `workback` .chasemoskal.com → `13.83.71.184`
		- `*.workback` .chasemoskal.com → `13.83.71.184`

&nbsp; **(c) install necessary infrastructure into the cluster**
1. install nginx-ingress into the cluster
	- create the ingress-basic namespace
		```sh
		kubectl create namespace ingress-basic
		```
	- use helm to install the controller
		```sh
		helm install nginx-ingress stable/nginx-ingress \
			--namespace ingress-basic \
			--set rbac.create=false \
			--set controller.replicaCount=2 \
			--set controller.nodeSelector."beta\.kubernetes\.io/os"=linux \
			--set defaultBackend.nodeSelector."beta\.kubernetes\.io/os"=linux \
			--set controller.service.loadBalancerIP="13.83.71.184"
		```
		- make sure rbac is disabled with `rbac.create=false`
		- set the loadBalancerIP to the static ingress ip
		- wait a bit and verify with `kubectl get service -l app=nginx-ingress --namespace ingress-basic`, you should see the external ip assigned after a minute or so
1. install acme cert-manager into cluster [*(cert-manager docs)*](https://cert-manager.io/docs/installation/kubernetes/)
	- install the cert-manager kubernetes custom resources
		```sh
		kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.14.0/cert-manager.crds.yaml
		```
	- create the cert-manager namespace
		```sh
		kubectl create namespace cert-manager
		```
	- add the jetstack helm repo
		```sh
		helm repo add jetstack https://charts.jetstack.io
		```
	- update the repo
		```sh
		helm repo update
		```
	- use helm to deploy cert-manager into the cluster
		```sh
		helm install cert-manager jetstack/cert-manager \
			--namespace cert-manager \
			--set rbac.create=false \
			--version v0.14.0
		```
		- ensure rbac is disabled in the above command
	- verify the install
		```sh
		kubectl get pods --namespace cert-manager
		```
		- you should see a few cert-manager pods running

## deploy app to cluster

- deploy manually using helm
- deploy automatically using github actions
