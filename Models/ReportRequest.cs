using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace myActivities.Models
{
    public class ReportRequest
    {
        public string api_token { get; set; }
        public DateTime report_date { get; set; } 
    }
}