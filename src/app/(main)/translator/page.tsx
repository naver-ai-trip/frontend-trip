"use client";

import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { translationService, TextTranslationRequest } from "@/services/translation-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Languages,
  Upload,
  Mic,
  MicOff,
  Copy,
  History,
  Volume2,
  ArrowLeftRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import ImageWithToken from "@/components/image-with-token";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "th", name: "ไทย" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
];

const TranslatorPage = () => {
  const queryClient = useQueryClient();

  // Text translation states
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("ko");
  const [targetLanguage, setTargetLanguage] = useState("en");

  // Image translation states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageTargetLang, setImageTargetLang] = useState("en");
  const [imageResult, setImageResult] = useState("");

  // Speech translation states
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [speechTargetLang, setSpeechTargetLang] = useState("en");
  const [speechResult, setSpeechResult] = useState("");

  // Modal states
  const [selectedTranslation, setSelectedTranslation] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Fetch translation history
  const { data: history, isLoading: historyLoading } = useQuery<any>({
    queryKey: ["translations"],
    queryFn: translationService.getTranslations,
  });

  // Text translation mutation
  const textMutation = useMutation({
    mutationFn: (data: TextTranslationRequest) => translationService.translateText(data),
    onSuccess: (data) => {
      setOutputText(data.translated_text);
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      toast.success("Text translated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to translate text");
      console.error(error);
    },
  });

  // Image translation mutation
  const imageMutation = useMutation({
    mutationFn: ({
      file,
      targetLang,
    }: {
      file: File;
      targetLang: string;
      sourceLanguage?: string;
    }) => translationService.translateImage(file, targetLang, sourceLanguage),
    onSuccess: (data) => {
      setImageResult(data.translated_text);
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      toast.success("Image translated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to translate image");
      console.error(error);
    },
  });

  // Speech translation mutation
  const speechMutation = useMutation({
    mutationFn: ({ file, targetLang }: { file: File; targetLang: string }) =>
      translationService.translateSpeech(file, targetLang),
    onSuccess: (data) => {
      setSpeechResult(data.translated_text);
      queryClient.invalidateQueries({ queryKey: ["translations"] });
      toast.success("Speech translated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to translate speech");
      console.error(error);
    },
  });

  const handleTextTranslate = () => {
    if (!inputText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }

    textMutation.mutate({
      text: inputText,
      source_language: sourceLanguage,
      target_language: targetLanguage,
    });
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(outputText);
    setOutputText("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageTranslate = () => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }
    imageMutation.mutate({ file: imageFile, targetLang: imageTargetLang });
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const handleSpeechTranslate = () => {
    if (!audioFile) {
      toast.error("Please select an audio file");
      return;
    }
    speechMutation.mutate({ file: audioFile, targetLang: speechTargetLang });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const file = new File([blob], "recording.wav", { type: "audio/wav" });
        setAudioFile(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="bg-background min-h-screen pt-20">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 flex items-center gap-3 text-4xl font-bold">
            <Languages className="text-primary h-10 w-10" />
            Translator
          </h1>
          <p className="text-muted-foreground">
            Translate text, images, and speech instantly with AI-powered translation
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Translation Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="text" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">Text Translation</TabsTrigger>
                <TabsTrigger value="image">Image Translation</TabsTrigger>
                <TabsTrigger value="speech">Speech Translation</TabsTrigger>
              </TabsList>

              {/* Text Translation Tab */}
              <TabsContent value="text" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Text Translation
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleSwapLanguages}
                        className="h-8 w-8"
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Language Selectors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>From</Label>
                        <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>To</Label>
                        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Input/Output Areas */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Input Text</Label>
                        <Textarea
                          placeholder="Enter text to translate..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="min-h-[120px] resize-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Translation</Label>
                          {outputText && (
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(outputText)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Volume2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <Textarea
                          placeholder="Translation will appear here..."
                          value={outputText}
                          readOnly
                          className="bg-muted/50 min-h-[120px] resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleTextTranslate}
                      disabled={textMutation.isPending || !inputText?.trim()}
                      className="w-full"
                    >
                      {textMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Translate Text
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Image Translation Tab */}
              <TabsContent value="image" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Image Translation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Image Upload */}
                      <div className="space-y-4">
                        <Label>Select Image</Label>
                        <div
                          className="border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {imagePreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="mx-auto max-h-32 rounded"
                            />
                          ) : (
                            <div className="space-y-2">
                              <Upload className="text-muted-foreground mx-auto h-12 w-12" />
                              <p className="text-muted-foreground text-sm">Click to upload image</p>
                            </div>
                          )}
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />

                        <Select value={imageTargetLang} onValueChange={setImageTargetLang}>
                          <SelectTrigger>
                            <SelectValue placeholder="Target language" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Extracted & Translated Text</Label>
                          {imageResult && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(imageResult)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <Textarea
                          placeholder="Translated text will appear here..."
                          value={imageResult}
                          readOnly
                          className="bg-muted/50 min-h-[200px] resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleImageTranslate}
                      disabled={imageMutation.isPending || !imageFile}
                      className="w-full"
                    >
                      {imageMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Translate Image
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Speech Translation Tab */}
              <TabsContent value="speech" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Speech Translation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Audio Input */}
                      <div className="space-y-4">
                        <Label>Record or Upload Audio</Label>

                        {/* Recording Controls */}
                        <div className="flex gap-2">
                          <Button
                            variant={isRecording ? "destructive" : "outline"}
                            onClick={isRecording ? stopRecording : startRecording}
                            className="flex-1"
                          >
                            {isRecording ? (
                              <>
                                <MicOff className="mr-2 h-4 w-4" />
                                Stop Recording
                              </>
                            ) : (
                              <>
                                <Mic className="mr-2 h-4 w-4" />
                                Start Recording
                              </>
                            )}
                          </Button>

                          <Button variant="outline" onClick={() => audioInputRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </Button>
                        </div>

                        <input
                          ref={audioInputRef}
                          type="file"
                          accept="audio/*"
                          onChange={handleAudioUpload}
                          className="hidden"
                        />

                        {audioFile && (
                          <div className="bg-muted rounded-lg p-3">
                            <p className="text-sm">Audio file: {audioFile.name}</p>
                          </div>
                        )}

                        <Select value={speechTargetLang} onValueChange={setSpeechTargetLang}>
                          <SelectTrigger>
                            <SelectValue placeholder="Target language" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Speech Result */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Transcribed & Translated</Label>
                          {speechResult && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => copyToClipboard(speechResult)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <Textarea
                          placeholder="Transcription and translation will appear here..."
                          value={speechResult}
                          readOnly
                          className="bg-muted/50 min-h-[200px] resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleSpeechTranslate}
                      disabled={speechMutation.isPending || !audioFile}
                      className="w-full"
                    >
                      {speechMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Translate Speech
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Translation History Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Translations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {historyLoading ? (
                  <div className="py-8 text-center">
                    <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                    <p className="text-muted-foreground text-sm">Loading history...</p>
                  </div>
                ) : history?.data?.length === 0 ? (
                  <p className="text-muted-foreground py-8 text-center text-sm">
                    No translations yet
                  </p>
                ) : (
                  history?.data?.slice(0, 10).map((translation: any) => (
                    <div
                      key={translation.id}
                      className="hover:bg-muted/50 cursor-pointer rounded-lg border p-3 transition-colors"
                      onClick={() => {
                        setSelectedTranslation(translation);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {translation.source_type}
                        </Badge>
                        <span className="text-muted-foreground text-xs">
                          {new Date(translation.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {translation.source_type === "text" && (
                        <p className="mb-1 line-clamp-2 text-sm">{translation.source_text}</p>
                      )}
                      {translation.source_type === "image" && (
                        <ImageWithToken url={translation.file_url} />
                      )}
                      <p className="text-muted-foreground line-clamp-2 text-sm">
                        {translation.translated_text}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Translation Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Full Translation</DialogTitle>
              <DialogDescription>
                {selectedTranslation?.source_type && (
                  <Badge variant="outline" className="mt-2">
                    {selectedTranslation.source_type}
                  </Badge>
                )}
              </DialogDescription>
            </DialogHeader>

            {selectedTranslation && (
              <div className="space-y-6 py-4">
                {/* Source Content */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Source</h3>
                  {selectedTranslation.source_type === "text" && (
                    <div className="bg-muted/50 rounded-lg p-4 text-sm break-words whitespace-pre-wrap">
                      {selectedTranslation.source_text}
                    </div>
                  )}
                  {selectedTranslation.source_type === "image" && (
                    <div className="overflow-hidden rounded-lg border">
                      <ImageWithToken url={selectedTranslation.file_url} />
                    </div>
                  )}
                  {selectedTranslation.source_type === "speech" && (
                    <div className="bg-muted/50 rounded-lg p-4 text-sm">
                      <p className="text-muted-foreground italic">Audio file</p>
                    </div>
                  )}
                </div>

                {/* Translation Content */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Translation</h3>
                  <div className="bg-muted/50 rounded-lg p-4 text-sm break-words whitespace-pre-wrap">
                    {selectedTranslation.translated_text}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      copyToClipboard(selectedTranslation.translated_text);
                    }}
                    className="mt-2 w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Translation
                  </Button>
                </div>

                {/* Metadata */}
                <div className="text-muted-foreground grid grid-cols-2 gap-4 border-t pt-4 text-xs">
                  <div>
                    <p className="text-foreground mb-1 font-semibold">Date</p>
                    <p>{new Date(selectedTranslation.created_at).toLocaleString()}</p>
                  </div>
                  {selectedTranslation.source_language && (
                    <div>
                      <p className="text-foreground mb-1 font-semibold">Languages</p>
                      <p>
                        {selectedTranslation.source_language} →{" "}
                        {selectedTranslation.target_language}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TranslatorPage;
