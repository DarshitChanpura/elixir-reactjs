server {
	listen 80;
	listen [::]:80;

	root home/memory/src/memory;

	server_name memory.darshitchanpura.com;

	location / {
		proxy_pass http://localhost:5101;
		#try_files $uri $uri/ =404;
	}
}
