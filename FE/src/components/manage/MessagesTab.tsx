import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, HomeIcon, Bed, Wallet, Plus, FileText, User, ChevronLeft, ChevronRight,
  AlertCircle, PhoneCall, Trash2, Edit3, Camera, BadgeCheck, Phone, Zap, Droplets,
  ShieldCheck, Clock, CheckCircle, X, Search, Wrench, Mail, MessageSquare, PlusCircle,
  Image as ImageIcon, MapPin, Users, Settings, Lock as LockIcon, LogOut, MoreVertical,
  MoreHorizontal, Filter, ArrowUpDown, Maximize2, Info, Layers, Construction, ArrowLeft,
  Calendar, Eye, EyeOff, Sparkles, FileClock, Shield, ShieldAlert, Ban, Download,
  MessageCircle, FileSignature, HelpCircle, UserX, UserCheck, Save, Send, Smile, Video,
  ChevronDown, RefreshCw
} from 'lucide-react';
import Messaging from '../shared/Messaging';

import { User as SupabaseUser } from '@supabase/supabase-js';

interface MessagesTabProps {
  user: SupabaseUser | null;
}

export const MessagesTab = ({ user }: MessagesTabProps) => {
  const activeTab = 'messages';

  return (
    <>
      {activeTab === 'messages' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-1 overflow-hidden h-[calc(100vh-64px)] rounded-2xl border border-slate-200 shadow-sm"
            >
              <Messaging nguoiDung={user} vaiTro="landlord" />
            </motion.div>
          )}
    </>
  );
};
