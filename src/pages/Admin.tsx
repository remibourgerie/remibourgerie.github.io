import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RefreshCw, Save, Trash2, X, LogOut, Lock, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GoogleScholarIntegration from '@/components/GoogleScholarIntegration';

interface Publication {
  id?: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  citations: number;
  abstract: string;
  url?: string;
  pdf_url?: string;
  poster_url?: string;
  code_url?: string;
  presentation_url?: string;
  venue_url?: string;
  video_url?: string;
  illustration_url?: string;
  tags: string[];
  publication_type?: string;
}

const Admin: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Publication | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<Publication>({
    title: '', authors: [], journal: '', year: new Date().getFullYear(),
    citations: 0, abstract: '', tags: [],
  });
  const [showScholar, setShowScholar] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      return;
    }

    // Check if user is admin
    const { data: adminCheck } = await (supabase as any)
      .from('admin_users')
      .select('email')
      .eq('email', session.user.email)
      .single();

    if (!adminCheck) {
      toast({
        title: "Unauthorized",
        description: "You are not authorized to access this page.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    fetchPublications();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin
      const { data: adminCheck } = await (supabase as any)
        .from('admin_users')
        .select('email')
        .eq('email', email)
        .single();

      if (!adminCheck) {
        await supabase.auth.signOut();
        throw new Error('You are not authorized to access the admin panel.');
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });

      setIsAuthenticated(true);
      fetchPublications();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading publications",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pub: Publication) => {
    setEditingId(pub.id!);
    setEditForm({ ...pub });
  };

  const handleSave = async () => {
    if (!editForm || !editingId) return;

    try {
      const { error } = await supabase
        .from('publications')
        .update({
          title: editForm.title,
          authors: editForm.authors,
          journal: editForm.journal,
          year: editForm.year,
          citations: editForm.citations,
          abstract: editForm.abstract,
          url: editForm.url,
          pdf_url: editForm.pdf_url,
          poster_url: editForm.poster_url,
          code_url: editForm.code_url,
          presentation_url: editForm.presentation_url,
          venue_url: editForm.venue_url,
          video_url: editForm.video_url,
          illustration_url: editForm.illustration_url,
          tags: editForm.tags,
          publication_type: editForm.publication_type,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingId);

      if (error) throw error;

      toast({
        title: "Publication updated",
        description: "Changes saved successfully",
      });

      setEditingId(null);
      setEditForm(null);
      fetchPublications();
    } catch (error: any) {
      toast({
        title: "Error updating publication",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Publication deleted",
        description: "Publication removed successfully",
      });

      fetchPublications();
    } catch (error: any) {
      toast({
        title: "Error deleting publication",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleInsert = async () => {
    try {
      const { error } = await supabase.from('publications').insert({
        ...newForm,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast({ title: "Publication added", description: "New publication saved successfully" });
      setIsAdding(false);
      setNewForm({ title: '', authors: [], journal: '', year: new Date().getFullYear(), citations: 0, abstract: '', tags: [] });
      fetchPublications();
    } catch (error: any) {
      toast({ title: "Error adding publication", description: error.message, variant: "destructive" });
    }
  };

  const handleScholarSync = async (newPublications: any[]) => {
    try {
      let addedCount = 0;
      let updatedCount = 0;

      // Insert or update publications from Google Scholar
      for (const pub of newPublications) {
        // Check if publication already exists
        const { data: existing } = await supabase
          .from('publications')
          .select('id')
          .eq('title', pub.title)
          .single();

        if (!existing) {
          // Insert new publication
          const { error } = await supabase.from('publications').insert({
            title: pub.title,
            authors: pub.authors,
            journal: pub.journal,
            year: pub.year,
            citations: pub.citations || 0,
            abstract: pub.abstract,
            url: pub.url,
            tags: pub.tags || [],
          });

          if (!error) addedCount++;
        } else {
          // Update existing publication's citation count
          const { error } = await supabase
            .from('publications')
            .update({
              citations: pub.citations || 0,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

          if (!error) updatedCount++;
        }
      }

      toast({
        title: "Publications synced",
        description: `Added ${addedCount} new publications, updated ${updatedCount} existing ones from Google Scholar`,
      });

      fetchPublications();
      setShowScholar(false);
    } catch (error: any) {
      toast({
        title: "Error syncing publications",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateFormField = (field: keyof Publication, value: any) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
  };

  const addTag = (tag: string) => {
    if (!editForm || !tag.trim()) return;
    if (editForm.tags.includes(tag.trim())) return;
    setEditForm({ ...editForm, tags: [...editForm.tags, tag.trim()] });
  };

  const removeTag = (tag: string) => {
    if (!editForm) return;
    setEditForm({ ...editForm, tags: editForm.tags.filter(t => t !== tag) });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Lock className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? 'Logging in...' : 'Log In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Publications Admin</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsAdding(!isAdding)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Publication
            </Button>
            <Button onClick={() => setShowScholar(!showScholar)} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync from Google Scholar
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {isAdding && (
          <Card className="mb-8 border-primary/30">
            <CardHeader>
              <CardTitle>New Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Title</Label><Input value={newForm.title} onChange={e => setNewForm({...newForm, title: e.target.value})} /></div>
              <div><Label>Authors (comma separated)</Label><Input value={newForm.authors.join(', ')} onChange={e => setNewForm({...newForm, authors: e.target.value.split(',').map(a => a.trim())})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Journal/Venue</Label><Input value={newForm.journal} onChange={e => setNewForm({...newForm, journal: e.target.value})} /></div>
                <div><Label>Year</Label><Input type="number" value={newForm.year} onChange={e => setNewForm({...newForm, year: parseInt(e.target.value)})} /></div>
              </div>
              <div><Label>Abstract</Label><Textarea value={newForm.abstract} onChange={e => setNewForm({...newForm, abstract: e.target.value})} rows={4} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Paper URL (OpenReview / arXiv / DOI)</Label><Input value={newForm.url || ''} onChange={e => setNewForm({...newForm, url: e.target.value})} /></div>
                <div><Label>PDF URL</Label><Input value={newForm.pdf_url || ''} onChange={e => setNewForm({...newForm, pdf_url: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Code URL</Label><Input value={newForm.code_url || ''} onChange={e => setNewForm({...newForm, code_url: e.target.value})} /></div>
                <div><Label>Poster URL</Label><Input value={newForm.poster_url || ''} onChange={e => setNewForm({...newForm, poster_url: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Venue URL (journal / conference homepage)</Label><Input value={newForm.venue_url || ''} onChange={e => setNewForm({...newForm, venue_url: e.target.value})} placeholder="https://..." /></div>
                <div><Label>Presentation URL</Label><Input value={newForm.presentation_url || ''} onChange={e => setNewForm({...newForm, presentation_url: e.target.value})} placeholder="https://..." /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Video URL</Label><Input value={newForm.video_url || ''} onChange={e => setNewForm({...newForm, video_url: e.target.value})} placeholder="https://youtube.com/..." /></div>
                <div><Label>Illustration URL</Label><Input value={newForm.illustration_url || ''} onChange={e => setNewForm({...newForm, illustration_url: e.target.value})} placeholder="https://..." /></div>
              </div>
              <div><Label>Publication Type</Label><Input value={newForm.publication_type || ''} onChange={e => setNewForm({...newForm, publication_type: e.target.value})} placeholder="Conference, Journal, Workshop paper..." /></div>
              <div className="flex gap-2">
                <Button onClick={handleInsert}><Save className="w-4 h-4 mr-2" />Save</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showScholar && (
          <div className="mb-8">
            <GoogleScholarIntegration
              onPublicationsUpdate={handleScholarSync}
              currentPublications={publications}
            />
          </div>
        )}

        <div className="space-y-4">
          {publications.map((pub) => (
            <Card key={pub.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{pub.title}</span>
                  <div className="flex gap-2">
                    {editingId === pub.id ? (
                      <>
                        <Button size="sm" onClick={handleSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(null);
                            setEditForm(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(pub)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(pub.id!)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingId === pub.id && editForm ? (
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => updateFormField('title', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Authors (comma separated)</Label>
                      <Input
                        value={editForm.authors.join(', ')}
                        onChange={(e) => updateFormField('authors', e.target.value.split(',').map(a => a.trim()))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Journal/Venue</Label>
                        <Input
                          value={editForm.journal}
                          onChange={(e) => updateFormField('journal', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          type="number"
                          value={editForm.year}
                          onChange={(e) => updateFormField('year', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Abstract</Label>
                      <Textarea
                        value={editForm.abstract}
                        onChange={(e) => updateFormField('abstract', e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Paper URL (OpenReview / arXiv / DOI)</Label>
                        <Input
                          value={editForm.url || ''}
                          onChange={(e) => updateFormField('url', e.target.value)}
                          placeholder="https://scholar.google.com/..."
                        />
                      </div>
                      <div>
                        <Label>PDF URL</Label>
                        <Input
                          value={editForm.pdf_url || ''}
                          onChange={(e) => updateFormField('pdf_url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Poster URL</Label>
                        <Input
                          value={editForm.poster_url || ''}
                          onChange={(e) => updateFormField('poster_url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <Label>Code URL</Label>
                        <Input
                          value={editForm.code_url || ''}
                          onChange={(e) => updateFormField('code_url', e.target.value)}
                          placeholder="https://github.com/..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Venue URL (journal / conference homepage)</Label>
                        <Input
                          value={editForm.venue_url || ''}
                          onChange={(e) => updateFormField('venue_url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div>
                        <Label>Presentation URL</Label>
                        <Input
                          value={editForm.presentation_url || ''}
                          onChange={(e) => updateFormField('presentation_url', e.target.value)}
                          placeholder="https://... (slides/presentation)"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Video URL</Label>
                      <Input
                        value={editForm.video_url || ''}
                        onChange={(e) => updateFormField('video_url', e.target.value)}
                        placeholder="https://youtube.com/... or https://vimeo.com/..."
                      />
                    </div>

                    <div>
                      <Label>Illustration URL</Label>
                      <Input
                        value={editForm.illustration_url || ''}
                        onChange={(e) => updateFormField('illustration_url', e.target.value)}
                        placeholder="https://... (image URL for publication illustration)"
                      />
                    </div>

                    <div>
                      <Label>Publication Type</Label>
                      <Input
                        value={editForm.publication_type || ''}
                        onChange={(e) => updateFormField('publication_type', e.target.value)}
                        placeholder="e.g., Workshop paper, Conference, Journal, MSc thesis, PhD Thesis"
                      />
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {editForm.tags.map((tag) => (
                          <div
                            key={tag}
                            className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2"
                          >
                            {tag}
                            <button onClick={() => removeTag(tag)}>
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a keyword and press Enter or comma"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              const val = tagInput.replace(/,/g, '').trim();
                              if (val) { addTag(val); setTagInput(''); }
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-sm"
                          onClick={() => {
                            const val = tagInput.replace(/,/g, '').trim();
                            if (val) { addTag(val); setTagInput(''); }
                          }}
                        >Add</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <p><strong>Authors:</strong> {pub.authors.join(', ')}</p>
                    <p><strong>Journal:</strong> {pub.journal}</p>
                    <p><strong>Year:</strong> {pub.year} | <strong>Citations:</strong> {pub.citations}</p>
                    <p><strong>Type:</strong> {pub.publication_type || 'Not set'}</p>
                    <p><strong>Abstract:</strong> {pub.abstract}</p>
                    {pub.pdf_url && <p><strong>PDF:</strong> <a href={pub.pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary">Link</a></p>}
                    {pub.poster_url && <p><strong>Poster:</strong> <a href={pub.poster_url} target="_blank" rel="noopener noreferrer" className="text-primary">Link</a></p>}
                    {pub.code_url && <p><strong>Code:</strong> <a href={pub.code_url} target="_blank" rel="noopener noreferrer" className="text-primary">Link</a></p>}
                    {pub.presentation_url && <p><strong>Presentation:</strong> <a href={pub.presentation_url} target="_blank" rel="noopener noreferrer" className="text-primary">Link</a></p>}
                    {pub.venue_url && <p><strong>Venue:</strong> <a href={pub.venue_url} target="_blank" rel="noopener noreferrer" className="text-primary">Link</a></p>}
                    {pub.video_url && <p><strong>Video:</strong> <a href={pub.video_url} target="_blank" rel="noopener noreferrer" className="text-primary">Link</a></p>}
                    {pub.illustration_url && <p><strong>Illustration:</strong> <a href={pub.illustration_url} target="_blank" rel="noopener noreferrer" className="text-primary">View</a></p>}
                    <div className="flex flex-wrap gap-2">
                      {pub.tags.map((tag) => (
                        <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
