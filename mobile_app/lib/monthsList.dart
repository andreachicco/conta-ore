import  'package:flutter/material.dart';

class MonthsList extends StatefulWidget {
  MonthsList({required this.yearSelected, required this.years, Key? key }) : super(key: key);

  List<dynamic> years;
  int yearSelected;
  
  @override
  _MonthsListState createState() => _MonthsListState();
}

class _MonthsListState extends State<MonthsList> {
  
  @override
  Widget build(BuildContext context) {
    List<dynamic> months = widget.years[widget.yearSelected - 2022]['months'];
    
    return ListView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemCount: months.length,
      itemBuilder: (context, int index) {
        return Card(
          elevation: 20,
          margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: ListTile(
            title: Text(months[index]['name'],
              style: Theme.of(context).textTheme.headline3
            ),
            subtitle: Text(months[index]['index'].toString(),
              style: Theme.of(context).textTheme.headline1
            ),
            leading: const Icon(Icons.edit_calendar,
              size: 40,
            ), 
            trailing: const Icon(Icons.east,
              size: 35,
            ),
            onTap: () {}, //TODO
          ),
        );
      },
    );
  }
}