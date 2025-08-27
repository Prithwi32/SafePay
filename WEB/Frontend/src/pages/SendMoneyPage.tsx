"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VoiceConfirmationModal } from "../components/voice-confirmation-modal";
import { useTranslate } from "../hooks/useTranslate";

export default function SendMoneyPage() {
  const { t, lang, setLang } = useTranslate("en");

  const [formData, setFormData] = useState({
    recipientName: "",
    transferMethod: "upi",
    upiId: "",
    accountNumber: "",
    ifscCode: "",
    amount: "",
    note: "",
  });
  const [isElderMode, setIsElderMode] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Fraud detection
  const [fraudWarning, setFraudWarning] = useState("");

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Validation ---
  const validateForm = () => {
    if (!formData.recipientName) return t("errors.recipientName");
    if (!formData.amount || Number(formData.amount) <= 0)
      return t("errors.amount");
    if (
      formData.transferMethod === "upi" &&
      !/^[\w.-]+@[\w.-]+$/.test(formData.upiId)
    )
      return t("errors.upiId");
    if (formData.transferMethod === "account") {
      if (!/^\d{9,18}$/.test(formData.accountNumber))
        return t("errors.accountNumber");
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode))
        return t("errors.ifscCode");
    }
    return null;
  };

  const handleSubmit = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    if (Number(formData.amount) > 50000) {
      setFraudWarning(t("fraud.largeAmount"));
      return;
    }

    if (formData.transferMethod === "upi" && formData.upiId.includes("fraud")) {
      setFraudWarning(t("fraud.suspiciousUpi"));
      return;
    }

    setFraudWarning("");
    setShowVoiceModal(true);
  };

  const handleConfirm = () => {
    setShowVoiceModal(false);
    alert(t("success.message"));
  };

  return (
    <div
      className={`container mx-auto py-8 ${
        isElderMode ? "text-xl" : "text-base"
      }`}
    >
      {/* Header with Elder Mode + Language Switch */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("sendMoney")}</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsElderMode((prev) => !prev)}
          >
            {isElderMode ? t("elderMode.disable") : t("elderMode.enable")}
          </Button>

          <select
            className="border rounded p-2"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>
      </div>

      <p className="mb-4 text-muted-foreground">{t("transferSecurely")}</p>

      <Card>
        <CardHeader>
          <CardTitle>{t("transferDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Recipient Name */}
            <div>
              <Label>{t("recipientName")}</Label>
              <Input
                value={formData.recipientName}
                onChange={(e) => handleChange("recipientName", e.target.value)}
                placeholder={t("recipientName")}
              />
            </div>

            {/* Transfer Method */}
            <div>
              <Label>{t("transferMethod")}</Label>
              <select
                className="border rounded p-2 w-full"
                value={formData.transferMethod}
                onChange={(e) => handleChange("transferMethod", e.target.value)}
              >
                <option value="upi">{t("transferMethodUpi")}</option>
                <option value="account">{t("transferMethodAccount")}</option>
              </select>
            </div>

            {/* Conditional Inputs */}
            {formData.transferMethod === "upi" ? (
              <div>
                <Label>{t("upiId")}</Label>
                <Input
                  value={formData.upiId}
                  onChange={(e) => handleChange("upiId", e.target.value)}
                  placeholder="example@upi"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label>{t("accountNumber")}</Label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleChange("accountNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>{t("ifscCode")}</Label>
                  <Input
                    value={formData.ifscCode}
                    onChange={(e) => handleChange("ifscCode", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Amount */}
            <div>
              <Label>{t("amount")}</Label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="₹0"
              />
            </div>

            {/* Note */}
            <div>
              <Label>{t("note")}</Label>
              <Input
                value={formData.note}
                onChange={(e) => handleChange("note", e.target.value)}
                placeholder={t("note")}
              />
            </div>

            {/* Fraud Warning */}
            {fraudWarning && (
              <p className="text-red-500 font-semibold">{fraudWarning}</p>
            )}

            {/* Submit Button */}
            <Button className="w-full" onClick={handleSubmit}>
              {t("sendButton", { amount: formData.amount || "0" })}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voice Modal */}
      <VoiceConfirmationModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onConfirm={handleConfirm}
        amount={formData.amount}
        recipientName={formData.recipientName}
        isElderMode={isElderMode}
        currentLanguage={lang}
      />
    </div>
  );
}
