import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginSchema } from "../utils/validation";
import { login } from "../auth/authService";

const SOCIALS = [
  {
    name: "Google",
    icon: {
      uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
    },
  },
  {
    name: "Apple",
    icon: {
      uri: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
  },
  {
    name: "GitHub",
    icon: {
      uri: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    },
  },
];

export default function LoginScreen({ navigation }) {
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleLogin = async () => {
    try {
      await loginSchema.validate(values, { abortEarly: false });
      setLoading(true);

      try {
        const userData = await login(values.username, values.password);
        navigation.replace("MainTabs");
      } catch (apiError) {
        Alert.alert("Login Failed", apiError.message || "Invalid credentials");
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.name === "ValidationError") {
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        Alert.alert("Error", err.message || "Something went wrong");
      }
    }
  };

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="light-content" backgroundColor="#10131a" />
        <View style={{ height: 32 }} />

        {/* Logo */}
        <Image
          source={require("../../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Welcome Text */}
        <Text style={styles.heading}>Welcome Back, Achiever!</Text>

        {/* Google Sign In Button */}
        <TouchableOpacity style={styles.socialButton} activeOpacity={0.85}>
          <Image
            source={{
              uri: "https://img.icons8.com/plasticine/100/google-logo.png",
            }}
            style={styles.socialIcon}
            resizeMode="contain"
          />
          <Text style={styles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or sign in with email</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Username or Email</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#7e8a9a"
            placeholder="Enter your username or email"
            value={values.username}
            onChangeText={(v) => handleChange("username", v)}
            autoCapitalize="none"
          />
          <Text style={styles.errorTextFixed}>{errors.username || " "}</Text>

          <View style={styles.passwordRow}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholderTextColor="#7e8a9a"
            placeholder="Enter your password"
            value={values.password}
            onChangeText={(v) => handleChange("password", v)}
            secureTextEntry
          />
          <Text style={styles.errorTextFixed}>{errors.password || " "}</Text>
        </View>

        {/* Sign In Button */}
        <View style={styles.signInButtonWrapper}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign Up */}
        <View style={styles.signUpWrapper}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10131a",
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 24,
    alignSelf: "center",
    marginBottom: 12,
    backgroundColor: "#181c24",
    borderWidth: 2,
    borderColor: "#232d3f",
    shadowColor: "#0cb9f2",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  heading: {
    marginHorizontal: 24,
    marginTop: 8,
    fontSize: 24,
    textAlign: "center",
    fontWeight: "700",
    color: "#f5f7fa",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 18,
    height: 45,
    backgroundColor: "#181c24",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#232d3f",
    shadowColor: "#0cb9f2",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  socialIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#f5f7fa",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#232d3f",
    opacity: 0.5,
  },
  dividerText: {
    marginHorizontal: 10,
    backgroundColor: "#10131a",
    color: "#7e8a9a",
    fontSize: 15,
    fontWeight: "500",
  },
  form: {
    marginHorizontal: 24,
    marginTop: 32,
  },
  label: {
    fontSize: 17,
    fontWeight: "500",
    color: "#f5f7fa",
    marginBottom: 7,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#181c24",
    borderRadius: 10,
    paddingHorizontal: 16,
    color: "#f5f7fa",
    borderWidth: 1,
    borderColor: "#232d3f",
    marginBottom: 0,
    fontSize: 14,
  },
  errorTextFixed: {
    color: "#ff4d4f",
    minHeight: 18,
    marginBottom: 4,
    fontSize: 13,
  },
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
    marginTop: 8,
  },
  forgotText: {
    color: "#0cb9f2",
    fontSize: 15,
    fontWeight: "600",
  },
  signInButtonWrapper: {
    marginHorizontal: 24,
    marginTop: 5,
  },
  signInButton: {
    height: 40,
    backgroundColor: "#0cb9f2",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0cb9f2",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    color: "#10131a",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  signUpWrapper: {
    marginTop: 32,
    marginBottom: 32,
    alignItems: "center",
  },
  signUpText: {
    color: "#7e8a9a",
    fontSize: 16,
    fontWeight: "500",
  },
  signUpLink: {
    color: "#0cb9f2",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 2,
  },
});
