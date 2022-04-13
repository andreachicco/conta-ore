class Day{
  late String name;
  late int index;
  dynamic extraordinary;
  late bool isExpanded;
  
  Day.fromMap(dynamic day){
    name = day['name'];
    index = day['index'];
    extraordinary = day['extraordinary'];
    isExpanded = false;
  }
}