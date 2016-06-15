using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Formatting;
using System.Threading.Tasks;

namespace myActivities.Code
{
    public class ApiCalls
    {   
        public static string CallPivotalTrackerAPI(string api_token, string req_api_url )
        {

            string JsonObject = null;   
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://www.pivotaltracker.com/");
                client.DefaultRequestHeaders.Add("X-TrackerToken", api_token);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                using (HttpResponseMessage response = client.GetAsync(req_api_url).Result)
                {
                    using (HttpContent content = response.Content)
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            JsonObject = content.ReadAsStringAsync().Result;
                        }
                    }
                }
            }
            return JsonObject;
        }
    }
}




