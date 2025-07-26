import React, { useState } from 'react';
import { GeminiService } from '../services/GeminiService';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { View, Text, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, Alert, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function OnboardingScreen({ navigation, route }) {
  const [values, setValues] = useState({ college: '', branch: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pendingCorrection, setPendingCorrection] = useState(null);
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [selectedCollegeSuggestion, setSelectedCollegeSuggestion] = useState('');

  const handleChange = (field, value) => {
    setValues({ ...values, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      let standardizedCollege = values.college;
      let standardizedBranch = values.branch;
      // Pre-validation: check if college input is actually a branch/degree
      const branchKeywords = [
        'mca', 'bca', 'b.tech', 'btech', 'm.tech', 'mtech', 'mba', 'bba', 'bsc', 'msc', 'bcom', 'mcom', 'ba', 'ma', 'phd', 'doctorate', 'engineering', 'computer science', 'cse', 'ece', 'eee', 'it', 'civil', 'mechanical', 'electrical', 'electronics', 'master of computer applications', 'master of business administration', 'bachelor of technology', 'bachelor of science', 'bachelor of commerce', 'bachelor of arts', 'master of science', 'master of commerce', 'master of arts'
      ];
      
      // Add debug log to verify keywords are loaded
      console.log('[Onboarding] Branch keywords loaded:', branchKeywords.length, 'keywords');
      let isBranchInput = false;
      if (values.college.trim()) {
        const collegeInputLower = values.college.trim().toLowerCase();
        console.log('[Onboarding] Processing college input:', values.college, 'lowercase:', collegeInputLower);
        
        for (let kw of branchKeywords) {
          // Use word boundaries to avoid false positives
          const wordBoundaryRegex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          if (wordBoundaryRegex.test(collegeInputLower)) {
            isBranchInput = true;
            console.log('[Onboarding] Matched branch keyword:', kw);
            break;
          }
        }
        if (isBranchInput) {
          console.log('[Onboarding] College input detected as branch/degree:', values.college);
        }
        const db = getFirestore();
        const collegesCol = collection(db, 'colleges');
        const collegesSnap = await getDocs(collegesCol);
        let collegeExists = false;
        collegesSnap.forEach(docSnap => {
          if (docSnap.id.toLowerCase() === collegeInputLower) {
            collegeExists = true;
          }
        });
        console.log('[Onboarding] Firestore check - collegeExists:', collegeExists, 'isBranchInput:', isBranchInput);
        if (!isBranchInput) {
          console.log('[Onboarding] Calling Gemini for college suggestions for input:', values.college);
          // Use Gemini to get a list of similar colleges
          const collegePrompt = `Given the input '${values.college}', list up to 5 similar or likely standardized college names in India as a comma-separated list. Only reply with college names (e.g., IIT Delhi, NIT Trichy, University of Mumbai). Do NOT reply with branch names, degrees, or anything like 'Master of Computer Applications'. If none, reply 'unknown'.\n\nExample input: "IIT"\nExample output: "IIT Delhi, IIT Bombay, IIT Kanpur, IIT Madras, IIT Kharagpur"\n\nExample input: "St Xavier"\nExample output: "St Xavier's College Mumbai, St Xavier's College Kolkata, St Xavier's College Ranchi, St Xavier's College Ahmedabad, St Xavier's College Jaipur"`;
          const collegeResult = await GeminiService.generateQuizOrTip(collegePrompt);
          console.log('Gemini collegeResult:', collegeResult);
          console.log('[Onboarding] About to check collegeResult, value:', collegeResult, 'toLowerCase:', collegeResult?.toLowerCase());
          if (collegeResult && collegeResult.toLowerCase() !== 'unknown') {
            // Additional filter to prevent branch/degree responses
            const resultLower = collegeResult.toLowerCase();
            console.log('[Onboarding] Checking Gemini result for branch keywords:', resultLower);
            const isBranchResponse = branchKeywords.some(keyword => {
              // Use word boundaries to avoid false positives like "mba" in "Sambalpur"
              const wordBoundaryRegex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
              const matches = wordBoundaryRegex.test(resultLower);
              if (matches) {
                console.log('[Onboarding] Found branch keyword in result:', keyword);
              }
              return matches;
            });
            
            if (isBranchResponse) {
              console.log('[Onboarding] Gemini returned branch/degree, skipping suggestions:', collegeResult);
            } else {
              let suggestions;
              if (collegeResult.includes(',')) {
                suggestions = collegeResult.split(',').map(s => s.trim()).filter(Boolean);
              } else {
                suggestions = [collegeResult.trim()];
              }
              // Filter out any individual suggestions that might be branches
              suggestions = suggestions.filter(suggestion => {
                const suggestionLower = suggestion.toLowerCase();
                return !branchKeywords.some(keyword => {
                  const wordBoundaryRegex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                  return wordBoundaryRegex.test(suggestionLower);
                });
              });
              
              // Always add the user's original input as the first option
              if (!suggestions.includes(values.college.trim())) {
                suggestions.unshift(values.college.trim());
              }
              
              if (suggestions.length > 0) {
                console.log('Setting collegeSuggestions:', suggestions);
                setCollegeSuggestions(suggestions);
                setShowCollegeModal(true);
                setLoading(false);
                return;
              } else {
                console.log('[Onboarding] All suggestions filtered out as branches/degrees');
              }
            }
          } else {
            console.log('No valid suggestions from Gemini, using original input');
            // If no suggestions, still show modal with user's input
            setCollegeSuggestions([values.college.trim()]);
            setShowCollegeModal(true);
            setLoading(false);
            return;
          }
        } else if (isBranchInput) {
          // Treat as branch, not college
          standardizedBranch = values.college.trim();
          standardizedCollege = '';
        }
      }
      // Validate branch with Gemini (with filtering)
      if (values.branch.trim()) {
        const branchPrompt = `Given the input '${values.branch}', what is the full standardized name of this branch? Reply with only the standardized name, or 'unknown' if not found.`;
        const branchResult = await GeminiService.generateQuizOrTip(branchPrompt);
        console.log('[Onboarding] Branch validation - Gemini result:', branchResult);
        
        // Filter out college responses in branch validation
        if (branchResult && branchResult.toLowerCase() !== 'unknown') {
          const branchResultLower = branchResult.toLowerCase();
          const isCollegeResponse = branchResultLower.includes('college') || branchResultLower.includes('university') || branchResultLower.includes('institute');
          
          if (isCollegeResponse) {
            console.log('[Onboarding] Branch validation returned college name, ignoring:', branchResult);
            standardizedBranch = values.branch;
          } else if (branchResult.toLowerCase() !== values.branch.trim().toLowerCase()) {
            setPendingCorrection({ field: 'branch', suggestion: branchResult });
            setLoading(false);
            return;
          } else {
            standardizedBranch = branchResult;
          }
        } else {
          standardizedBranch = values.branch;
        }
      }
      // Save to user profile in Firestore
      const db = getFirestore();
      const userId = route?.params?.uid || (globalThis.user && globalThis.user.uid);
      if (userId) {
        const userDoc = doc(db, 'users', userId);
        await setDoc(userDoc, {
          college: standardizedCollege,
          branch: standardizedBranch,
          onboardingComplete: true,
        }, { merge: true });
      }
      navigation.replace('App', { screen: 'MainTabs', params: { screen: 'Home' } });
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save details');
    }
    setLoading(false);
  };

  // Handle college suggestion selection
  const handleCollegeSuggestionSelect = async (selected) => {
    setShowCollegeModal(false);
    setSelectedCollegeSuggestion(selected);
    const db = getFirestore();
    const collegeDoc = doc(db, 'colleges', selected);
    const docSnap = await getDoc(collegeDoc);
    if (!docSnap.exists()) {
      await setDoc(collegeDoc, { name: selected });
    }
    // Save to user profile in Firestore
    const userId = route?.params?.uid || (globalThis.user && globalThis.user.uid);
    if (userId) {
      const db = getFirestore();
      const userDoc = doc(db, 'users', userId);
      await setDoc(userDoc, {
        college: selected,
        branch: values.branch,
        onboardingComplete: true,
      }, { merge: true });
    }
    Alert.alert('Onboarding Complete', 'Your details have been saved.');
    navigation.replace('App', { screen: 'MainTabs', params: { screen: 'Home' } });
  };
  // Handle college suggestion cancel (use original entry)
  const handleCollegeSuggestionCancel = async () => {
    setShowCollegeModal(false);
    const db = getFirestore();
    const collegeDoc = doc(db, 'colleges', values.college.trim());
    const docSnap = await getDoc(collegeDoc);
    if (!docSnap.exists()) {
      await setDoc(collegeDoc, { name: values.college.trim() });
    }
    // Save to user profile in Firestore
    const userId = route?.params?.uid || (globalThis.user && globalThis.user.uid);
    if (userId) {
      const db = getFirestore();
      const userDoc = doc(db, 'users', userId);
      await setDoc(userDoc, {
        college: values.college.trim(),
        branch: values.branch,
        onboardingComplete: true,
      }, { merge: true });
    }
    Alert.alert('Onboarding Complete', 'Your details have been saved.');
    navigation.replace('App', { screen: 'MainTabs', params: { screen: 'Home' } });
  };

  // Handle correction confirmation
  const handleCorrectionConfirm = () => {
    if (pendingCorrection) {
      setValues({ ...values, [pendingCorrection.field]: pendingCorrection.suggestion });
      setPendingCorrection(null);
      handleContinue();
    }
  };
  const handleCorrectionCancel = () => {
    setPendingCorrection(null);
    handleContinue();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#111618', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <KeyboardAvoidingView
        style={{ width: '100%' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8 }}>Tell us about you</Text>
          <Text style={{ fontSize: 16, color: '#9cb2ba', textAlign: 'center' }}>This helps us personalize your experience</Text>
        </View>
        {/* College Field */}
        <View style={{ marginBottom: 18, marginHorizontal: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#232D3F', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2c3335' }}>
            <MaterialCommunityIcons name="school-outline" size={20} color="#7e8a9a" style={{ marginRight: 8 }} />
            <TextInput
              style={{ flex: 1, height: 48, color: '#fff', fontSize: 16 }}
              placeholderTextColor="#7e8a9a"
              placeholder="College Name"
              value={values.college}
              onChangeText={v => handleChange('college', v)}
              autoCapitalize="words"
              returnKeyType="next"
              selectionColor="#0cb9f2"
            />
          </View>
          {errors.college ? (
            <Text style={{ color: '#ff5a5f', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.college}</Text>
          ) : null}
        </View>
        {/* Branch Field */}
        <View style={{ marginBottom: 18, marginHorizontal: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#232D3F', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#2c3335' }}>
            <MaterialCommunityIcons name="book-outline" size={20} color="#7e8a9a" style={{ marginRight: 8 }} />
            <TextInput
              style={{ flex: 1, height: 48, color: '#fff', fontSize: 16 }}
              placeholderTextColor="#7e8a9a"
              placeholder="Branch (e.g. MCA, CSE)"
              value={values.branch}
              onChangeText={v => handleChange('branch', v)}
              autoCapitalize="characters"
              returnKeyType="done"
              selectionColor="#0cb9f2"
            />
          </View>
          {errors.branch ? (
            <Text style={{ color: '#ff5a5f', fontSize: 13, marginTop: 2, marginLeft: 4 }}>{errors.branch}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={{ height: 52, backgroundColor: loading ? '#7e8a9a' : '#0cb9f2', borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: 18, marginTop: 10, opacity: loading ? 0.7 : 1 }}
          onPress={!loading ? handleContinue : undefined}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.2 }}>Continue</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      {/* College suggestions modal - improved UI */}
      {showCollegeModal && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', zIndex: 999 }}>
          <View style={{ backgroundColor: '#1e2834', borderRadius: 20, padding: 28, width: '92%', maxWidth: 420, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 12 }}>
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <MaterialCommunityIcons name="school" size={32} color="#0cb9f2" style={{ marginBottom: 12 }} />
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', letterSpacing: 0.5 }}>Select Your College</Text>
              <Text style={{ color: '#8a9ba8', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
                Choose from the suggestions below or use your original entry
              </Text>
            </View>
            
            {/* Suggestions list with improved styling */}
            <ScrollView 
              style={{ maxHeight: 240, width: '100%', marginBottom: 20 }} 
              contentContainerStyle={{ paddingBottom: 8 }} 
              showsVerticalScrollIndicator={false}
            >
              {collegeSuggestions.length > 0 ? (
                collegeSuggestions.map((suggestion, idx) => (
                  <TouchableOpacity
                    key={suggestion}
                    style={{
                      backgroundColor: selectedCollegeSuggestion === suggestion ? '#0cb9f2' : '#2a3441',
                      borderRadius: 12,
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      marginBottom: 10,
                      borderWidth: selectedCollegeSuggestion === suggestion ? 2 : 1,
                      borderColor: selectedCollegeSuggestion === suggestion ? '#34c759' : '#3a4651',
                      width: '100%',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2
                    }}
                    onPress={() => handleCollegeSuggestionSelect(suggestion)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <MaterialCommunityIcons 
                        name={idx === 0 ? "account-edit" : "school-outline"} 
                        size={18} 
                        color={selectedCollegeSuggestion === suggestion ? '#fff' : '#0cb9f2'} 
                        style={{ marginRight: 12 }} 
                      />
                      <Text style={{ 
                        color: '#fff', 
                        fontWeight: selectedCollegeSuggestion === suggestion ? '700' : '600', 
                        fontSize: 15,
                        flex: 1,
                        lineHeight: 20
                      }}>
                        {suggestion}
                      </Text>
                      {idx === 0 && (
                        <View style={{ backgroundColor: '#0cb9f2', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                          <Text style={{ color: '#fff', fontSize: 10, fontWeight: '600' }}>YOUR ENTRY</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                  <MaterialCommunityIcons name="magnify" size={48} color="#5a6670" style={{ marginBottom: 12 }} />
                  <Text style={{ color: '#8a9ba8', fontSize: 16, textAlign: 'center' }}>No suggestions found</Text>
                </View>
              )}
            </ScrollView>
            
            {/* Action button with improved styling */}
            <TouchableOpacity
              style={{ 
                backgroundColor: '#e74c3c', 
                borderRadius: 14, 
                paddingVertical: 14, 
                paddingHorizontal: 32, 
                width: '100%',
                shadowColor: '#e74c3c',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6
              }}
              onPress={handleCollegeSuggestionCancel}
              activeOpacity={0.9}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16, textAlign: 'center', letterSpacing: 0.3 }}>
                Use My Original Entry
              </Text>
            </TouchableOpacity>
            
            {/* Close hint */}
            <Text style={{ color: '#5a6670', fontSize: 12, textAlign: 'center', marginTop: 16 }}>
              Tap outside to dismiss
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
