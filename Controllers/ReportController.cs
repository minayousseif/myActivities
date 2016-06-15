using System;
using System.Web;
using System.Web.Mvc;
using myActivities.Models;
using myActivities.Code;

namespace myActivities.Controllers
{
    public class ReportController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetLatest(ReportRequest report_request)
        {
            string report_date = HttpUtility.HtmlEncode(report_request.report_date.ToString("s"));
            string report_enddate = HttpUtility.HtmlEncode(report_request.report_date.AddHours(24).ToString("s"));
            var activities = ApiCalls.CallPivotalTrackerAPI(report_request.api_token,
                string.Format("/services/v5/my/activity?occurred_after={0}&occurred_before={1}", report_date, report_enddate));
            var jsondata = MyActivities.GetLatest(MyActivities.Get(activities));
            return Json(jsondata, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult RememberMe(string api_token)
        {
            try
            {
                if (string.IsNullOrEmpty(api_token))
                { return Json(new { saved = false }); }
                else
                {
                    var RememberMeCookie = new HttpCookie("API_TOKEN_COOKIE")
                    {
                        Value = api_token,
                        Expires = DateTime.Now.AddDays(365d)
                    };
                    Response.Cookies.Add(RememberMeCookie);
                }
            }
            catch { return Json(new { saved = false }); }
            return Json(new { saved = true });
        }

        [HttpGet]
        public ActionResult GetSavedToken()
        {
            string api_token = string.Empty;
            try
            {
                if (Request.Cookies["API_TOKEN_COOKIE"] != null)
                {
                    api_token = Request.Cookies["API_TOKEN_COOKIE"].Value;
                    var RememberMeCookie = new HttpCookie("API_TOKEN_COOKIE")
                    {
                        Value = api_token,
                        Expires = DateTime.Now.AddDays(365d)
                    };
                    Response.Cookies.Add(RememberMeCookie);
                }
            }
            catch (Exception)
            {
                return Json(string.Empty);
            }
            return Json(api_token, JsonRequestBehavior.AllowGet);
        }

    }
}