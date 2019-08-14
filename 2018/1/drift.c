#include <stdio.h>
#include <stdlib.h>
#include "ll.h"

#define FNAME "in.txt"

int get_modifier(char *cs, int len);
int count_lines(char* fname);

int match_state(int* values, int length);

int main()
{
    char *line = NULL;
    size_t len = 0;
    ssize_t read;
    FILE *fp;
    int lines = count_lines(FNAME);
    int vptr[lines];

    if ((fp = fopen(FNAME, "r")) == NULL)
    {
        perror("File Read Error\n");
        exit(EXIT_FAILURE);
    }
    
    int sum = 0;
    int val;
    int i = 0;
    while ((read = getline(&line, &len, fp)) != -1)
    {
        //printf("Got line of length %zu :\n", read);
        printf("%s", line);
        val = get_modifier(line, read);
        vptr[i] = val;
        i++;
        sum += val;
        //printf("Value: %d\t Sum: %d\n", val, sum);
    }

    fclose(fp);
    free(line);

    for(int i=0; i<lines;i++)
    {
        printf("Values Array %d : %d\n", i, vptr[i]);
    }
    printf("SUM: %d\n", sum);
    printf("StateMatch: %d\n", match_state(vptr, lines));

    exit(EXIT_SUCCESS);
}

int match_state(int* values, int length)
{
    int sum = 0;
    int i = 0;
    node_t* lst = create(0);
    while(1)
    {
        sum += values[i];
        if(exists(lst, sum)) return sum;
        add(&lst, sum);
        i = (i + 1) % length;
        //printf("SUM: %d\n", sum);
    }
}

int count_lines(char *fname)
{
    FILE *fp;
    int lines = 0;

    fp = fopen(fname, "r");

    char c;
    while ((c = fgetc(fp)) != 255)
    {
        if (c == '\n') lines++;
    }
    fclose(fp);
    return lines;
}

int get_modifier(char *cs, int len)
{
    char s[len];
    if(cs[0]=='+')
    {
        for(int i=0; i<len-2;i++)
        {
            s[i] = cs[i+1];
        }
    }
    else
    {
        for(int i=0; i<len-1; i++)
        {
            s[i] = cs[i];
        }
    }
    return atoi(s);
}

// Starting to define a linked list
