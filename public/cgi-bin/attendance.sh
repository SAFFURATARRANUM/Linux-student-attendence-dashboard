##!/bin/bash

CSV_FILE="$(dirname "$0")/../../data/attendance.csv"

echo "Content-Type: application/json"
echo ""

awk -F',' '
BEGIN {
    total=0
    eligible=0
    shortage=0
    sum=0
    first=1
    printf "{\"students\":["
}
NR > 1 {
    id=$1
    name=$2
    classes=$3
    attended=$4

    if (classes > 0)
        percentage=(attended/classes)*100
    else
        percentage=0

    total++
    sum+=percentage

    if (percentage >= 75) {
        eligible++
        status="Eligible"
    } else {
        shortage++
        status="Below 75%"
    }

    if (!first) printf ","
    first=0

    printf "{\"id\":\"%s\",\"name\":\"%s\",\"totalClasses\":%d,\"attendedClasses\":%d,\"percentage\":%.2f,\"status\":\"%s\"}", id,name,classes,attended,percentage,status
}
END {
    if (total > 0)
        average=sum/total
    else
        average=0

    printf "],\"summary\":{\"totalStudents\":%d,\"averageAttendance\":%.2f,\"eligibleCount\":%d,\"shortageCount\":%d}}\n",total,average,eligible,shortage
}
' "$CSV_FILE"