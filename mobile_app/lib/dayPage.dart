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
        padding: const EdgeInsets.all(15),
        itemCount: widget.days.length,
        itemBuilder: (context, int index) {
          return Row( 
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
            Container(
              width: 150,
              height: 60,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10)
              ),
              padding: const EdgeInsets.all(10),
              margin: const EdgeInsets.all(10),
              child: Row(
                children: [
                  Text(widget.days[index]['index'].toString(),
                    style: const TextStyle(
                      color: Colors.redAccent, 
                      fontSize: 40, 
                      fontWeight: FontWeight.w800
                    ),
                  ),
                  const SizedBox(width: 15),
                  Text(widget.days[index]['name'],
                    style: Theme.of(context).textTheme.headline3,
                  )
                ],
              ),
            ),
            Text('test')
          ]);
        },
      ),
    );
  }
}