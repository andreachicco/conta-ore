import 'package:flutter/material.dart';

class DaysPage extends StatefulWidget {
  DaysPage({ required this.days, required this.month, Key? key }) : super(key: key);
  List<dynamic> days;
  final String month;

  @override
  _DaysPageState createState() => _DaysPageState();
}

class _DaysPageState extends State<DaysPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).backgroundColor,
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.west, color: Theme.of(context).backgroundColor, size: 30,),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(widget.month,
          style: Theme.of(context).textTheme.headline2,
        ),
        backgroundColor: Theme.of(context).primaryColor,
        centerTitle: true,
      ),
      body: ListView.builder(
        itemCount: widget.days.length,
        itemBuilder: (context, int index) {
          return Card(child: ListTile(title: Text(widget.days[index]['name'])));
        },
      ),
    );
  }
}