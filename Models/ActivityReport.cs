using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace myActivities.Models
{
    public class ActivityReport
    {
        public string project { get; set; }
        public int story_id { get; set; }
        public string story { get; set; }
        public string story_type { get; set; }
        public string story_url { get; set; }
        public int comment_id { get; set; }
        public string change_type { get; set; }
        public string comments { get; set; }
        public bool has_attachment { get; set; }
        public string attachment_thumb { get; set; }
        public string attachment_url { get; set; }
        public DateTime update_date { get; set; }
        public DateTime occurred_at { get; set; }
    }
}