import 'package:flutter/material.dart';
import 'package:mobile_app/daypage/day.dart';

class DaysPage extends StatefulWidget {
  DaysPage({ required this.days, required this.month, Key? key }) : super(key: key);
  List<dynamic> days;
  final String month;

  @override
  _DaysPageState createState() => _DaysPageState();
}
class _DaysPageState extends State<DaysPage> {
  List<Day> _daysObjects = [];
  @override
  void initState(){
    _daysObjects = widget.days.map((day) => Day.fromMap(day)).toList();
    super.initState();
  }

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
      body: SingleChildScrollView( child: 
        ExpansionPanelList(
          expansionCallback: (panelIndex, isExpanded) {
            setState(() {
              _daysObjects[panelIndex].isExpanded = !isExpanded;
            });
          },
          children: _daysObjects.map((day) {
            return ExpansionPanel(
              headerBuilder: ((context, isExpanded) => ListTile(
                leading: Text(day.index.toString(),
                  style: TextStyle(
                    color: day.name == "dom" ? Colors.red : Colors.grey[600],
                    fontSize: 40,
                    fontWeight: FontWeight.w800
                    )
                  ),
                title: Text(day.name,
                  style: Theme.of(context).textTheme.headline3,
                  )
                )
              ),
              body: Placeholder(),
              isExpanded: day.isExpanded,
              canTapOnHeader: true,
              backgroundColor: Colors.white
            );
          }).toList(),
        ),
      )
    );
  }
}



Map<String, int> tabella_hash = {
  'mela':1,
  'pera':2,
  'arancia':0,
  'banana':0 //collisione
};

List<int> costo = [23, 34, 2, 1, 12];
