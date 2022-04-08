import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({ Key? key, required this.token }) : super(key: key);
  final String token;

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).backgroundColor,
      appBar: AppBar(
        title: Text("CONTA ORE STRAORDINARIO",
          style: Theme.of(context).textTheme.headline2,
        ),
        centerTitle: true,
        automaticallyImplyLeading: false,
        backgroundColor: Theme.of(context).primaryColor
      ),
      body: Text("body"),
    );
  }
}