import React, { useRef } from 'react';
import { useEventStore } from '../../store/useEventStore';
import { TonePersona, PostDepth } from '../../types';

export const InputStudio: React.FC = () => {
  const {
    attendeeNotes,
    setAttendeeNotes,
    selectedTone,
    setSelectedTone,
    selectedDepth,
    setSelectedDepth,
    attachments,
    addAttachment,
    removeAttachment,
    generatePost,
    isGenerating,
    showToast,
    userHashtags,
    addUserHashtags,
    removeUserHashtag,
    clearUserHashtags,
  } = useEventStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hashtagInput, setHashtagInput] = React.useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      addAttachment({
        id: `upload-${Date.now()}-${i}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        category: 'Session Photo',
        url,
        altText: file.name,
      });
    }
    showToast(`Added ${files.length} photo(s) to media dropzone!`);
  };

  const handleAiSuggest = () => {
    setAttendeeNotes(
      "Attended keynote on Agentic AI architectures. Key insight: enterprise data pipelines are replacing batch ETL with real-time vector search. Mahatma Mandir networking highlighted multi-agent orchestration frameworks across Kubernetes."
    );
    showToast('💡 Added AI-suggested keynote takeaways!');
  };

  const handleToolbarInsert = (action: 'bullet' | 'numbered' | 'quote' | 'emoji' | 'tag') => {
    if (action === 'bullet') {
      setAttendeeNotes(`${attendeeNotes}\n• `);
    } else if (action === 'numbered') {
      setAttendeeNotes(`${attendeeNotes}\n1. `);
    } else if (action === 'quote') {
      setAttendeeNotes(`${attendeeNotes}\n"The future of code is collaborative intelligence." — Keynote`);
    } else if (action === 'emoji') {
      setAttendeeNotes(`${attendeeNotes} 🚀 `);
    } else if (action === 'tag') {
      setAttendeeNotes(`${attendeeNotes} #GoogleCloudNext `);
    }
  };

  const quickChips = [
    { label: 'Add Speaker Quote', snippet: '\n• Speaker Quote: "Agents orchestrate, humans create."' },
    { label: 'Mention Booth #412', snippet: '\n• Booth #412: Live demo on scalable multimodal indexing' },
    { label: 'Tag Teammate', snippet: '\n• Great catching up with @Alex Rivera from platform ops' },
    { label: 'Call for Coffee Chat', snippet: '\n• Free to connect for coffee near the Mahatma Mandir Grand Atrium!' },
  ];

  const handleAddHashtagsFromInput = () => {
    if (!hashtagInput.trim()) return;
    addUserHashtags(hashtagInput);
    setHashtagInput('');
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHashtagsFromInput();
    } else if (e.key === ',') {
      e.preventDefault();
      handleAddHashtagsFromInput();
    }
  };

  const handleHashtagPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData('text');
    if (pasteData && (pasteData.includes(',') || pasteData.includes(' ') || pasteData.includes('#'))) {
      e.preventDefault();
      addUserHashtags(pasteData);
      setHashtagInput('');
    }
  };

  const handleAppendTagsToNotes = () => {
    if (userHashtags.length === 0) return;
    const tagsString = '\n\n' + userHashtags.join(' ');
    setAttendeeNotes(attendeeNotes + tagsString);
    showToast(`Appended ${userHashtags.length} hashtag(s) to notes!`);
  };

  const suggestedEventTags = [
    '#AgenticAI',
    '#MultiCloud',
    '#Kubernetes',
    '#GujaratTech',
    '#DevCommunity',
    '#FinOps',
    '#DataMesh',
    '#CloudNative',
  ];

  return (
    <div className="space-y-6">
      {/* SECTION 1: Event Photo & Media Dropzone */}
      <div className="rounded-2xl bg-surface-container-low p-6 space-y-4 shadow-xl border border-outline-variant/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-surface-container-high text-secondary">
              <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
            </span>
            <div>
              <h2 className="text-base font-semibold text-on-surface">Event Photo & Media Dropzone</h2>
              <p className="text-xs text-outline">Visual evidence doubles LinkedIn algorithmic reach</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-container-high text-secondary-container">
            {attachments.length} Attached
          </span>
        </div>

        {/* Dropzone Container */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative rounded-xl bg-surface-container-lowest/60 hover:bg-surface-container-lowest p-6 text-center transition-all cursor-pointer border border-dashed border-outline-variant/40 hover:border-secondary"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-surface-container-high group-hover:scale-110 flex items-center justify-center text-secondary transition-all">
              <span className="material-symbols-outlined text-2xl">cloud_upload</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-on-surface">
                Drag & drop conference selfies, session photos, or slides
              </p>
              <p className="text-xs text-outline">PNG, JPG up to 25MB · Auto-cropped to 1.91:1 LinkedIn ratio</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-2 px-3 py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface text-xs font-mono transition-colors cursor-pointer"
            >
              Browse Files
            </button>
          </div>
        </div>

        {/* Uploaded Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {attachments.map((att) => (
            <div
              key={att.id}
              className="relative group rounded-xl overflow-hidden bg-surface-container aspect-video shadow-md border border-outline-variant/30"
            >
              <img
                src={att.url}
                alt={att.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/90 via-transparent to-transparent flex flex-col justify-between p-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-[10px] font-mono text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    {att.category}
                  </span>
                  <button
                    type="button"
                    title="Remove attachment"
                    onClick={() => removeAttachment(att.id)}
                    className="w-6 h-6 rounded-full bg-surface-container-highest/90 text-on-surface-variant hover:text-error flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-inverse-surface">
                  <span className="truncate max-w-[140px] text-white">{att.name}</span>
                  <span className="text-outline text-[10px]">{att.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Key Takeaways & Session Highlights */}
      <div className="rounded-2xl bg-surface-container-low p-6 space-y-4 shadow-xl border border-outline-variant/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-surface-container-high text-primary">
              <span className="material-symbols-outlined text-lg">edit_note</span>
            </span>
            <div>
              <h2 className="text-base font-semibold text-on-surface">Key Takeaways & Session Highlights</h2>
              <p className="text-xs text-outline">Drop rough thoughts; our agent structures hooks & formatting</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAiSuggest}
            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-sm">auto_fix_high</span>
            <span>AI Suggest Points</span>
          </button>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 px-3 py-1.5 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
          <button
            type="button"
            onClick={() => handleToolbarInsert('bullet')}
            className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            title="Bullet List"
          >
            <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
          </button>
          <button
            type="button"
            onClick={() => handleToolbarInsert('numbered')}
            className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            title="Numbered List"
          >
            <span className="material-symbols-outlined text-sm">format_list_numbered</span>
          </button>
          <button
            type="button"
            onClick={() => handleToolbarInsert('quote')}
            className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            title="Quote Highlight"
          >
            <span className="material-symbols-outlined text-sm">format_quote</span>
          </button>
          <div className="w-px h-4 bg-outline-variant/40 mx-1" />
          <button
            type="button"
            onClick={() => handleToolbarInsert('emoji')}
            className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            title="Insert Rocket Emoji"
          >
            <span className="material-symbols-outlined text-sm">sentiment_satisfied</span>
          </button>
          <button
            type="button"
            onClick={() => handleToolbarInsert('tag')}
            className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            title="Add Session Tag"
          >
            <span className="material-symbols-outlined text-sm">tag</span>
          </button>
          <div className="ml-auto text-xs font-mono text-outline">
            {attendeeNotes.length} / 1,500 chars
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            rows={4}
            value={attendeeNotes}
            onChange={(e) => setAttendeeNotes(e.target.value)}
            placeholder="What were the biggest moments? Key speakers, stats, product reveals, personal reflections..."
            className="w-full rounded-xl bg-surface-container-lowest p-3.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container transition-all resize-none border border-outline-variant/30"
          />
        </div>

        {/* Quick Injections Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-outline uppercase tracking-wider">
            Quick Injections
          </span>
          <div className="flex flex-wrap gap-2">
            {quickChips.map((qc) => (
              <button
                key={qc.label}
                type="button"
                onClick={() => {
                  setAttendeeNotes(attendeeNotes + qc.snippet);
                  showToast(`Injected snippet: ${qc.label}`);
                }}
                className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer border border-outline-variant/30"
              >
                <span className="text-secondary font-bold">+</span>
                <span>{qc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-outline-variant/30 my-2" />

        {/* Multiple Hashtags Input Area (Below Quick Injections) */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-base">tag</span>
              <span className="text-[11px] font-mono text-outline uppercase tracking-wider font-medium">
                Custom Post Hashtags
              </span>
              <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary text-[10px] font-mono border border-outline-variant/30">
                {userHashtags.length} Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              {userHashtags.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleAppendTagsToNotes}
                    className="text-[11px] font-mono text-secondary hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                    title="Append active hashtags directly into the notes textarea"
                  >
                    <span className="material-symbols-outlined text-xs">note_add</span>
                    <span>Append to Notes</span>
                  </button>
                  <span className="text-outline text-xs">•</span>
                  <button
                    type="button"
                    onClick={clearUserHashtags}
                    className="text-[11px] font-mono text-outline hover:text-error flex items-center gap-1 transition-colors cursor-pointer"
                    title="Clear all hashtags"
                  >
                    <span className="material-symbols-outlined text-xs">clear_all</span>
                    <span>Clear All</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Hashtag Multi-Input Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary font-mono font-bold text-sm">
                #
              </span>
              <input
                type="text"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagKeyDown}
                onPaste={handleHashtagPaste}
                placeholder="Add hashtags e.g. GujaratAI, CloudSummit, Kubernetes (comma, space or Enter)"
                className="w-full rounded-xl bg-surface-container-lowest pl-8 pr-3.5 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-secondary focus:bg-surface-container transition-all border border-outline-variant/30"
              />
            </div>
            <button
              type="button"
              onClick={handleAddHashtagsFromInput}
              disabled={!hashtagInput.trim()}
              className="px-3.5 py-2.5 rounded-xl bg-surface-container-highest hover:bg-secondary hover:text-surface text-on-surface text-xs font-mono font-medium flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border border-outline-variant/40 shrink-0"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add Tag</span>
            </button>
          </div>

          {/* Current Hashtags Pill Badges */}
          <div className="p-3 rounded-xl bg-surface-container-lowest/60 border border-outline-variant/20 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-outline">
              <span>Active Tags in LinkedIn Generator</span>
              <span>Click <span className="text-secondary font-bold">×</span> to remove</span>
            </div>

            {userHashtags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userHashtags.map((tag) => (
                  <span
                    key={tag}
                    className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container border border-outline-variant/40 hover:border-secondary/60 text-secondary text-xs font-mono shadow-sm transition-all"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeUserHashtag(tag)}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-surface-container-high transition-colors cursor-pointer"
                      title={`Remove ${tag}`}
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-outline italic py-1">
                No hashtags added yet. Type tags above or click quick suggestions below.
              </div>
            )}
          </div>

          {/* Suggested Hashtags */}
          <div className="space-y-1.5 pt-0.5">
            <span className="text-[10px] font-mono text-outline uppercase tracking-wider">
              Popular Suggested Tags:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedEventTags.map((tag) => {
                const isAdded = userHashtags.some((t) => t.toLowerCase() === tag.toLowerCase());
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!isAdded) {
                        addUserHashtags(tag);
                      } else {
                        removeUserHashtag(tag);
                      }
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-mono flex items-center gap-1 transition-all cursor-pointer border ${
                      isAdded
                        ? 'bg-secondary/15 text-secondary border-secondary/40'
                        : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/30'
                    }`}
                  >
                    <span>{isAdded ? '✓' : '+'}</span>
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Post Tone & Persona Selector */}
      <div className="rounded-2xl bg-surface-container-low p-6 space-y-5 shadow-xl border border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-surface-container-high text-tertiary">
            <span className="material-symbols-outlined text-lg">tune</span>
          </span>
          <div>
            <h2 className="text-base font-semibold text-on-surface">Post Tone & Voice Persona</h2>
            <p className="text-xs text-outline">Tailors the narrative archetype to your personal brand</p>
          </div>
        </div>

        {/* Tone Horizontal Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Professional */}
          <button
            type="button"
            onClick={() => setSelectedTone('professional')}
            className={`flex flex-col p-3 rounded-xl text-left transition-all cursor-pointer border ${
              selectedTone === 'professional'
                ? 'bg-primary-container/20 border-primary shadow-md'
                : 'bg-surface-container border-outline-variant/30 hover:bg-surface-container-high'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base mb-1">💼</span>
              {selectedTone === 'professional' && <span className="w-2 h-2 rounded-full bg-secondary" />}
            </div>
            <span className={`text-sm font-medium ${selectedTone === 'professional' ? 'text-primary' : 'text-on-surface'}`}>
              Professional
            </span>
            <span className="text-[11px] font-mono text-outline mt-0.5 line-clamp-1">Crisp summary</span>
          </button>

          {/* Grateful */}
          <button
            type="button"
            onClick={() => setSelectedTone('grateful')}
            className={`flex flex-col p-3 rounded-xl text-left transition-all cursor-pointer border ${
              selectedTone === 'grateful'
                ? 'bg-primary-container/20 border-primary shadow-md'
                : 'bg-surface-container border-outline-variant/30 hover:bg-surface-container-high'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base mb-1">🙏</span>
              {selectedTone === 'grateful' && <span className="w-2 h-2 rounded-full bg-secondary" />}
            </div>
            <span className={`text-sm font-medium ${selectedTone === 'grateful' ? 'text-primary' : 'text-on-surface'}`}>
              Grateful
            </span>
            <span className="text-[11px] font-mono text-outline mt-0.5 line-clamp-1">Warm thanks</span>
          </button>

          {/* Takeaways */}
          <button
            type="button"
            onClick={() => setSelectedTone('takeaways')}
            className={`flex flex-col p-3 rounded-xl text-left transition-all cursor-pointer border ${
              selectedTone === 'takeaways'
                ? 'bg-primary-container/20 border-secondary shadow-md'
                : 'bg-surface-container border-outline-variant/30 hover:bg-surface-container-high'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base mb-1">💡</span>
              {selectedTone === 'takeaways' && <span className="w-2 h-2 rounded-full bg-secondary" />}
            </div>
            <span className={`text-sm font-medium ${selectedTone === 'takeaways' ? 'text-secondary font-semibold' : 'text-on-surface'}`}>
              Takeaways
            </span>
            <span className="text-[11px] font-mono text-secondary mt-0.5 line-clamp-1">Bulleted insights</span>
          </button>

          {/* Storyteller */}
          <button
            type="button"
            onClick={() => setSelectedTone('storyteller')}
            className={`flex flex-col p-3 rounded-xl text-left transition-all cursor-pointer border ${
              selectedTone === 'storyteller'
                ? 'bg-primary-container/20 border-primary shadow-md'
                : 'bg-surface-container border-outline-variant/30 hover:bg-surface-container-high'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base mb-1">🚀</span>
              {selectedTone === 'storyteller' && <span className="w-2 h-2 rounded-full bg-secondary" />}
            </div>
            <span className={`text-sm font-medium ${selectedTone === 'storyteller' ? 'text-primary' : 'text-on-surface'}`}>
              Storyteller
            </span>
            <span className="text-[11px] font-mono text-outline mt-0.5 line-clamp-1">Behind scenes</span>
          </button>
        </div>

        {/* Desired Post Depth Selector */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-mono text-outline">Desired Post Depth:</span>
          <div className="inline-flex p-1 rounded-xl bg-surface-container-lowest gap-1 border border-outline-variant/20">
            {(['short', 'standard', 'deep'] as PostDepth[]).map((depth) => {
              const labels: Record<PostDepth, string> = {
                short: 'Short & Punchy',
                standard: 'Standard (Recommended)',
                deep: 'In-depth Deep Dive',
              };
              const isActive = selectedDepth === depth;
              return (
                <button
                  key={depth}
                  type="button"
                  onClick={() => setSelectedDepth(depth)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-surface-container-high text-on-surface font-medium shadow-sm'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  {labels[depth]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 4: Primary Action Button */}
      <div className="space-y-2">
        <button
          type="button"
          disabled={isGenerating}
          onClick={generatePost}
          className="relative group w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary-container via-tertiary-container to-secondary-container hover:brightness-110 active:scale-[0.99] text-white font-medium text-base flex items-center justify-center gap-2 shadow-2xl transition-all overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isGenerating ? (
            <>
              <span className="material-symbols-outlined text-xl animate-spin">
                progress_activity
              </span>
              <span>Synthesizing Post...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl transition-transform group-hover:rotate-12">
                auto_awesome
              </span>
              <span>Generate LinkedIn Post (AI)</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-between px-2 text-xs font-mono text-outline">
          <span className="flex items-center gap-1.5 text-secondary">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-on-surface font-medium">Gemini 3.8 Flash</span>
            <span className="text-outline">Connected</span>
          </span>
          <span className="text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-secondary">auto_awesome</span>
            Real-time API Engine
          </span>
        </div>
      </div>
    </div>
  );
};
