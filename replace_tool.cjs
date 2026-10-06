const fs = require('fs');
const content = fs.readFileSync('src/app/UnifiedHomePage.tsx', 'utf8');

const startMarker = '<div className="overflow-hidden rounded-3xl bg-white shadow-[0_28px_80px_-28px_rgba(21,128,61,0.15)] ring-1 ring-[rgba(21,128,61,0.10)]">';
const endMarker = '</div>\n          </section>\n\n          {/* AI Detector Logos';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf('          {/* AI Detector Logos');

if (startIndex === -1 || endIndex === -1) {
    console.log("Could not find markers.", startIndex, endIndex);
    process.exit(1);
}

const replacement = `<div className="relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] ring-1 ring-slate-200/60">
              {/* Decorative top gradient line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-green-300 via-green-500 to-green-700 opacity-80" />
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/40">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                  </div>
                  <span className="text-xs font-bold tracking-widest text-slate-700 uppercase">Live Humanizer</span>
                </div>
                {currentCredits !== undefined && isSignedIn && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50/80 px-3 py-1.5 rounded-full ring-1 ring-green-600/10">
                    <Zap className="h-3.5 w-3.5" />
                    <span>{currentCredits} credits</span>
                  </div>
                )}
              </div>

              {/* Content Grid - Dynamic Layout */}
              <div className="p-5 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                  {/* Left Column - Input Box */}
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
                        Input
                      </label>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md">
                        {originalText.trim().split(/\\s+/).filter(Boolean).length} words
                      </div>
                    </div>

                    {/* Input Box */}
                    <div className="relative flex-1 group">
                      <div className={cn(
                        "h-[450px] rounded-2xl border-[1.5px] transition-all duration-300 overflow-hidden relative",
                        isDragging
                          ? "border-green-500 bg-green-50/50 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-4 ring-green-500/10"
                          : originalText
                          ? "border-slate-300 bg-white shadow-sm hover:border-slate-400 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10"
                          : "border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 focus-within:bg-white focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/10"
                      )}>
                        <ScrollArea className="h-full z-10 relative">
                          <Textarea
                            value={originalText}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                              setOriginalText(e.target.value);
                              setUploadedFileName(null);
                            }}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            placeholder="Paste your AI-generated text here (Ctrl+V)..."
                            className="w-full min-h-[450px] resize-none border-0 bg-transparent p-5 sm:p-6 text-[15px] leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus-visible:ring-0 selection:bg-green-100"
                            disabled={isHumanizing}
                          />
                        </ScrollArea>
                      </div>

                      {/* Drop Zone Overlay */}
                      {!originalText && !isHumanizing && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                          <div className="text-center max-w-[280px]">
                            <div className="inline-flex flex-col items-center gap-4 px-6 py-8 rounded-2xl border border-slate-200 bg-white/60 backdrop-blur-md shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100">
                                <FileText className="w-5 h-5 text-slate-400" />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium text-slate-600 mb-1 leading-snug">
                                  Paste text or{" "}
                                  <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-green-600 hover:text-green-700 font-semibold underline underline-offset-2 pointer-events-auto transition-colors"
                                  >
                                    upload file
                                  </button>
                                </p>
                                <p className="text-[11px] font-medium text-slate-400">
                                  .txt, .docx, .pdf
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Warning for < 250 words */}
                    {originalText && originalText.trim().split(/\\s+/).filter(Boolean).length < 250 && (
                      <div className="mt-3 p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/60">
                        <div className="flex items-center gap-2">
                          <Info className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                          <p className="text-[11px] text-orange-800 font-medium">
                            Use 250+ words for maximum bypass effectiveness.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tone preset */}
                    <div className="mt-5">
                      <div className="mb-2.5 flex items-center justify-between">
                        <label className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
                          Tone
                        </label>
                        {!hasPresetAccess && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                            <Lock className="h-3 w-3" />
                            Premium Locked
                          </span>
                        )}
                      </div>

                      <div className="sm:hidden">
                        <Select
                          value={preset}
                          onValueChange={handlePresetSelect}
                          disabled={isHumanizing}
                        >
                          <SelectTrigger
                            className="h-11 w-full rounded-xl border-slate-200 bg-white text-sm shadow-sm focus:ring-green-500"
                          >
                            <SelectValue placeholder="Default" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {PRESETS.map((p) => {
                              const locked = p.isPremium && !hasPresetAccess;
                              return (
                                <SelectItem key={p.value} value={p.value} className="py-2.5">
                                  <span className="flex items-center gap-2">
                                    {locked && <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
                                    <span>{p.label}</span>
                                  </span>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="hidden sm:flex flex-wrap gap-2">
                        {PRESETS.map((p) => {
                          const locked = p.isPremium && !hasPresetAccess;
                          const active = preset === p.value;
                          return (
                            <button
                              key={p.value}
                              type="button"
                              disabled={isHumanizing}
                              onClick={() => handlePresetSelect(p.value)}
                              title={locked ? \`\${p.label} is locked until you subscribe\` : p.description}
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-all",
                                active && !locked && "border-green-600 bg-green-50 text-green-700 shadow-[0_2px_10px_rgba(34,197,94,0.15)] ring-1 ring-green-600",
                                !active && !locked && "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
                                locked && "border-slate-200 bg-slate-50 text-slate-400 opacity-70 hover:border-slate-300",
                                isHumanizing && "cursor-not-allowed opacity-50",
                              )}
                            >
                              {locked && <Lock className="h-3 w-3 opacity-60" />}
                              {p.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 space-y-3">
                      <Button
                        onClick={handleHumanize}
                        disabled={!originalText.trim() || isHumanizing || wordCount < 100}
                        className="group relative w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[15px] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.3)] hover:-translate-y-px transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                        
                        {isHumanizing ? (
                          <span className="flex items-center gap-2 relative z-10">
                            <Loader2 className="w-5 h-5 animate-spin text-green-400" />
                            Processing...
                          </span>
                        ) : wordCount < 100 && originalText.trim() ? (
                          <span className="flex items-center gap-2 relative z-10">
                            <Lock className="w-4 h-4 text-slate-400" />
                            Need {100 - wordCount} more words
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 relative z-10">
                            <Sparkles className="w-4 h-4 text-green-400" />
                            Humanize Text
                          </span>
                        )}
                      </Button>

                      {originalText && (
                        <Button
                          onClick={() => {
                            setOriginalText("");
                            setHumanizedText("");
                            setUploadedFileName(null);
                          }}
                          variant="ghost"
                          className="w-full h-10 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 font-medium text-[13px]"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-2" />
                          Clear all
                        </Button>
                      )}
                    </div>

                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.docx,.pdf,.md"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>

                  {/* Right Column - Output Box */}
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
                        Output
                      </label>
                      {humanizedText && !isHumanizing && (
                        <div className="flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-green-500 text-white shadow-sm flex items-center gap-1">
                            <Check className="w-3 h-3" strokeWidth={3} />
                            0% AI Detected
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Output Box */}
                    <div className="relative flex-1">
                      <div className={cn(
                        "h-[450px] rounded-2xl border-[1.5px] transition-all duration-500 overflow-hidden relative",
                        isHumanizing
                          ? "border-green-400 bg-white shadow-[0_0_40px_rgba(34,197,94,0.15)] ring-4 ring-green-500/10"
                          : humanizedText
                          ? "border-green-200 bg-gradient-to-b from-green-50/30 to-white shadow-sm"
                          : "border-slate-200 border-dashed bg-slate-50/50"
                      )}>
                        
                        {isHumanizing && (
                          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.08),transparent_60%)] animate-pulse" />
                        )}

                        <ScrollArea className="h-full z-10 relative">
                          <div className="p-5 sm:p-6">
                            {isHumanizing ? (
                              <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
                                <div className="relative flex items-center justify-center w-16 h-16">
                                  <div className="absolute inset-0 rounded-xl bg-green-100 animate-ping opacity-60"></div>
                                  <div className="relative w-16 h-16 bg-white border border-green-200 shadow-sm rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-green-500 animate-pulse" />
                                  </div>
                                </div>
                                {thoughtsList.length > 0 && (
                                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-green-500" />
                                    <p className="text-[13px] font-medium text-slate-600 animate-pulse">
                                      {thoughtsList[0]}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : humanizedText ? (
                              <div className="prose prose-sm max-w-none">
                                <p className="text-[15px] leading-relaxed text-slate-800 whitespace-pre-wrap selection:bg-green-100">
                                  {humanizedText}
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center min-h-[350px]">
                                <div className="text-center max-w-[240px]">
                                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100/80 border border-slate-200">
                                    <CheckCircle2 className="h-6 w-6 text-slate-300" strokeWidth={1.5} />
                                  </div>
                                  <p className="text-[14px] font-medium text-slate-600 mb-1">
                                    Ready to humanize
                                  </p>
                                  <p className="text-[13px] leading-relaxed text-slate-400">
                                    Your natural, undetectable output will appear here.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </ScrollArea>

                        {/* Character Counter */}
                        {humanizedText && !isHumanizing && (
                          <div className="absolute bottom-3 right-3 text-[11px] font-medium text-slate-400 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md border border-slate-100 shadow-sm">
                            {humanizedText.length} characters
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {humanizedText && !isHumanizing && (
                        <div className="mt-4 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="flex-1 h-11 rounded-xl border-slate-200 bg-white hover:border-green-600 hover:bg-green-50 hover:text-green-700 transition-colors shadow-sm font-semibold text-[13px]"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 mr-2 text-green-600" />
                                Copied to clipboard
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2 text-slate-400" />
                                Copy text
                              </>
                            )}
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleDownload("txt")}
                              variant="outline"
                              className="h-11 px-4 rounded-xl border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm text-slate-600 font-medium text-[13px]"
                              title="Download as .txt"
                            >
                              <Download className="w-4 h-4" />
                              <span className="ml-1.5">.txt</span>
                            </Button>
                            <Button
                              onClick={() => handleDownload("docx")}
                              variant="outline"
                              className="h-11 px-4 rounded-xl border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition-colors shadow-sm text-slate-600 font-medium text-[13px]"
                              title="Download as Word Document"
                            >
                              <Download className="w-4 h-4" />
                              <span className="ml-1.5">.docx</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </section>
`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync('src/app/UnifiedHomePage.tsx', newContent, 'utf8');
console.log("Successfully replaced tool box section.");
