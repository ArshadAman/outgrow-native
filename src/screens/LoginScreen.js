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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginSchema } from "../utils/validation";
import { login } from "../auth/authService";
import { authStyles } from "../styles/authStyles";

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
        style={authStyles.container}
        contentContainerStyle={authStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="light-content" backgroundColor="#10131a" />
        <View style={authStyles.topSpacing} />

        {/* Logo */}
        <Image
          source={require("../../assets/icon.png")}
          style={authStyles.logo}
          resizeMode="contain"
        />

        {/* Welcome Text */}
        <Text style={authStyles.heading}>Welcome Back, Achiever!</Text>

        {/* Google Sign In Button */}
        <TouchableOpacity style={authStyles.socialButton} activeOpacity={0.85}>
          <Image
            source={{
              uri: "https://img.icons8.com/plasticine/100/google-logo.png",
            }}
            style={authStyles.socialIcon}
            resizeMode="contain"
          />
          <Text style={authStyles.socialButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={authStyles.dividerRow}>
          <View style={authStyles.dividerLine} />
          <Text style={authStyles.dividerText}>or sign in with email</Text>
          <View style={authStyles.dividerLine} />
        </View>

        {/* Form */}
        <View style={authStyles.form}>
          <Text style={authStyles.label}>Username or Email</Text>
          <TextInput
            style={authStyles.input}
            placeholderTextColor="#7e8a9a"
            placeholder="Enter your username or email"
            value={values.username}
            onChangeText={(v) => handleChange("username", v)}
            autoCapitalize="none"
          />
          <Text style={authStyles.errorTextFixed}>{errors.username || " "}</Text>

          <View style={authStyles.passwordRow}>
            <Text style={authStyles.label}>Password</Text>
            <TouchableOpacity>
              <Text style={authStyles.forgotText}>Forgot?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={authStyles.input}
            placeholderTextColor="#7e8a9a"
            placeholder="Enter your password"
            value={values.password}
            onChangeText={(v) => handleChange("password", v)}
            secureTextEntry
          />
          <Text style={authStyles.errorTextFixed}>{errors.password || " "}</Text>
        </View>

        {/* Sign In Button */}
        <View style={authStyles.signInButtonWrapper}>
          <TouchableOpacity
            style={authStyles.signInButton}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={authStyles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign Up */}
        <View style={authStyles.authSwitchWrapper}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={authStyles.authSwitchText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
              <Text style={authStyles.authSwitchLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
