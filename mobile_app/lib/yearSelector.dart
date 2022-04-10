import 'package:flutter/material.dart';

class YearSelector extends StatefulWidget {
  YearSelector({required this.yearSelected, required this.years, Key? key }) : super(key: key);
  
  List<dynamic> years;
  dynamic yearSelected;

  @override
  _YearSelectorState createState() => _YearSelectorState();
}

class _YearSelectorState extends State<YearSelector> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(5)
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: DropdownButton(
            icon: const Icon(Icons.arrow_drop_down_circle_outlined),
            iconSize: 18,
            borderRadius: BorderRadius.circular(10),
            value: widget.yearSelected,
            items: widget.years.map((dynamic e) {
              return DropdownMenuItem<dynamic>(
                value: e['year'],
                child: Text("${e['year']}",
                  style: Theme.of(context).textTheme.headline2,
                ),
              );
            }).toList(), 
            onChanged: (dynamic year) {
              setState(() {
                widget.yearSelected = year;
              });
            },
          ),
        ),
      ),
    );
  }
}