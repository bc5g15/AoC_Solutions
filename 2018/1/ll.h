#ifndef LINKED_LIST
#define LINKED_LIST
#include <stdbool.h>

typedef struct node {
    int val;
    struct node * next;
} node_t;

void add(node_t **, int);

bool exists(node_t *, int);

node_t * create(int);
#endif
