#include "ll.h"
#include <stdio.h>

int main()
{
    node_t* start = create(5);
    printf("%d\n", exists(start, 5));
    printf("%d\n", exists(start, 6));

    add(&start, 6);
    printf("%d\n", exists(start, 6));
    return 0;
}
