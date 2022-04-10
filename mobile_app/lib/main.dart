import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'homePage.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({ Key? key }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Conta Ore',
      theme: ThemeData(
        primaryColor: Colors.white,
        backgroundColor: Colors.blueAccent,
        textTheme: const TextTheme(
          headline1: TextStyle(fontSize: 25, fontWeight: FontWeight.w700, color: Colors.grey),
          headline2: TextStyle(fontSize: 25, fontWeight: FontWeight.w700, color: Colors.blueAccent),
          overline: TextStyle(color: Colors.blueAccent),
          bodyText1: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: Colors.grey)
        )
      ),
      home: LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({ Key? key }) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  
  //** TEXT FIELDS **/
  TextEditingController nameController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  bool obscurePswd = true; 
  Icon pswdIcon = const Icon(Icons.visibility);
  //********/
  
  //** LOGIN **/
  Widget progress = const SizedBox();  //"http://conta-ore-straordinari.herokuapp.com/api/v1/auth/login"
  final Uri urlLogin = Uri.parse("http://192.168.1.2:3000/api/v1/auth/login");
  String token = '';
  Widget errorMessage = const Text("");
  
  Future login(String username, String password) async {
    http.post(urlLogin, 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: jsonEncode({
        'username': username,
        'password': password
      })
    ).then((value) {
      if(value.statusCode == 200){  
        setState(() {
          final res = jsonDecode(value.body);
          token = res['token'];
          Navigator.pushAndRemoveUntil(context, 
          MaterialPageRoute(builder: 
              (context) => HomePage(token: token),
            ),
            (Route<dynamic> route) => false,
          );
        });
      } else{
        setState(() {
          errorMessage = const Text("ERRORE",
            style: TextStyle(
              color: Colors.red,
              fontSize: 15,
              fontWeight: FontWeight.w800
            ),
          );
          progress = const SizedBox();
        });
      }
    });

    setState(() {
      progress = CircularProgressIndicator(
        backgroundColor: Theme.of(context).primaryColor,
        color: Theme.of(context).backgroundColor,
      );
    });
  }
  //*********/


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Theme.of(context).backgroundColor,
      body: Column(
        children: [
          const SizedBox(height: 250),
          Container(
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: Theme.of(context).primaryColor,
              ),
            padding: const EdgeInsets.all(20),
            margin: const EdgeInsets.all(20),
            child: Column(
              children: [
                TextField(
                  controller: nameController,
                  keyboardType: TextInputType.text,
                  textInputAction: TextInputAction.send,
                  decoration: const InputDecoration(
                    icon: Icon(Icons.person),
                    hintText: 'Username',                    
                  ),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: passwordController,
                  keyboardType: TextInputType.text,
                  textInputAction: TextInputAction.send,
                  decoration:  InputDecoration(
                    icon: const Icon(Icons.lock),
                    hintText: 'Password', 
                    suffixIcon: IconButton(
                      icon: pswdIcon,
                      onPressed: ()  {
                        setState(() {
                          obscurePswd = !obscurePswd;
                          obscurePswd ? pswdIcon = const Icon(Icons.visibility) : pswdIcon = const Icon(Icons.visibility_off);
                        });
                      },
                    )                   
                  ),
                  obscureText: obscurePswd,
                ),
                const SizedBox(height: 30),
                Container(
                  width: 100,
                  decoration: BoxDecoration(
                    color: Theme.of(context).backgroundColor,
                    borderRadius: BorderRadius.circular(20)
                  ),
                  child: TextButton(
                    child: Text('LOGIN', 
                      style: TextStyle(
                        color: Theme.of(context).primaryColor,
                        fontSize: 18
                      ),
                    ),
                    onPressed: () {
                      login(nameController.text, passwordController.text);
                    }
                  ),
                ),
                SizedBox(height: 10,),
                errorMessage
              ],
            ),
          ),
          progress
        ],
      ),
    );
  }
}