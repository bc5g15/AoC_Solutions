#include "ll.h"
#include <stdlib.h>

bool exists(node_t *lst, int val)
{
    node_t * current = lst;

    while(current != NULL)
    {
        if(current->val==val)
            return true;
        current = current->next;
    }

    return false;
}

void add(node_t ** head, int val)
{
    node_t * new_node;
    new_node = malloc(sizeof(node_t));

    new_node->val = val;
    new_node->next = *head;
    *head = new_node;
}

node_t * create(int val)
{
    node_t * new_node;
    new_node = malloc(sizeof(node_t));

    new_node->val = val;
    new_node->next = NULL;
    return new_node;
}
