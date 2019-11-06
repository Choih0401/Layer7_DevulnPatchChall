#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

void* list[10];

void delete()
{
	int i;
	printf("Index : ");
	scanf("%d", &i);
	if(list[i])
	{
		free(list[i]);
		list[i] = 0;
		puts("Done");
	}
	else
	{
		puts("Can't delete value");
	}
}

void save(char* word, char* dest)
{
	int i;
	char* buf = alloca(strlen(word) + strlen(dest) + 2);
	strcpy(buf, word);
	strcat(buf, "|");
	strcat(buf, dest);
	for(i = 0;i < 10;i++)
	{
		if(!list[i])
		{
			list[i] = malloc(strlen(buf) + 1);
			strcpy(list[i], buf);
			puts("Done");
			break;
		}
	}
	if(i == 10)
	{
		puts("FULL!!! delete value");
	}
}


void show()
{
	int i;
	printf("Index : ");
	scanf("%d", &i);
	if(list[i])
	{
		printf("%s\n", list[i]);
	}
	else
	{
		puts("Can't read value");
	}
}

void find()
{
	int i;
	char buf[1024] = { 0 };
	char word[1024] = { 0 };
	char dest[1024] = { 0 };
	puts("Enter a word to find");
	printf(">> ");
	fflush(stdout);
	scanf("%s", word);
	getchar();
	for(i = 0;word[i];i++)
	{
		if(word[i] == 10)
		{
			word[i] = 0;
		}
	}
	downloadString(buf, word);
	if(getMeaning(buf, word, dest))
	{
		puts("Not exsist");
		return;
	}
	printf("Word : %s\nMeaning(in Korean) : %s\n", word, dest);
	printf("Save? (Y/N) : ");
	while(1)
	{
		scanf("%c", &i);
		switch(i)
		{
		case 'y':
		case 'Y':
			save(word, dest);
			puts("Saved");
			return;
		case 'n':
		case 'N':
			return;
		default:
			puts("Retry...");
			break;
		}
	}
}

int getMeaning(char* buffer, char* word, char* dest)
{
	int i;
	char* buf;
	char buf_[2056];
	char* word_ = alloca(strlen(word) + 1);
	memset(word_, 0, sizeof(word_));
	memset(dest, 0, sizeof(dest));
	strcpy(buf_, buffer);
	buf = strstr(buf_, "{");
	buf += strlen(word) * 2 + 29;
	buf = strstr(buf, "|") + 1;
	strncpy(word_, buf, strlen(word));
	if(strcmp(word, word_))
	{
		return 1;
	}
	buf += strlen(word) + 1;
	memcpy(dest, buf, strstr(buf, "\"") - buf);
	return 0;
}

void downloadString(char* buffer, char* word)
{
	struct addrinfo hints, *res;
	int sockfd;
	char buf[2056];
	int byte_count;
	memset(&hints, 0, sizeof(hints));
	hints.ai_family = AF_UNSPEC;
	hints.ai_socktype = SOCK_STREAM;
	getaddrinfo("suggest.dic.daum.net", "80", &hints, &res);
	sockfd = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
	connect(sockfd, res->ai_addr, res->ai_addrlen);
	char* header = alloca(115 + strlen(word));
	strcpy(header, "GET /dic_all_ctsuggest?mod=json&code=utf_in_out&enc=utf&cate=lan&q=");
	strcat(header, word);
	strcat(header, " HTTP/1.1\r\nHost: suggest.dic.daum.net\r\n\r\n");
	send(sockfd, header, strlen(header), 0);
	byte_count = recv(sockfd, buf, sizeof(buf), 0);
	strcpy(buffer, buf);
}

void menu()
{
	puts("------------------------------");
	puts("1. Find word meaning in online");
	puts("2. View saved words");
	puts("3. Delete saved words");
	puts("4. I'll be back.....");
	puts("------------------------------");
	printf(">> ");
	fflush(stdout);
}

int main()
{
	while(1)
	{
		int a;
		menu();
		scanf("%d", &a);
		switch(a)
		{
		case 1:
			find();
			break;
		case 2:
			show();
			break;
		case 3:
			delete();
			break;
		case 4:
			exit(0);
		default:
			puts("retry...");
			fflush(stdout);
			break;
		}
	}
}
