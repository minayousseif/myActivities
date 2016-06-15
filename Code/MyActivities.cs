using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using myActivities.Models;

namespace myActivities.Code
{
    public class MyActivities
    {
        // don't have time to query JSON with dynamic, I will use linq queries instead.
        // I will skip file attachments too, just simple text report. 
        public static dynamic GetLatest(List<Activity> ActivityList)
        {
            dynamic LatestActivities = new List<ActivityReport>();
            try
            {
                List<ActivityReport> myActivitiesList = new List<ActivityReport>();
                List<int> DeletedIds = new List<int>();
                if (ActivityList.Count > 0)
                {
                    ActivityList.ForEach(deletedact => deletedact.changes.Where(deletedchange => deletedchange.change_type == "delete")
                                                                         .ToList().ForEach(deletedchanges => DeletedIds.Add(deletedchanges.id)));
                    ActivityList.ForEach(act =>
                    {
                        act.changes.Where(change => change.kind == "comment" &&
                             change.change_type != "delete" &&
                             !string.IsNullOrEmpty(change.new_values.text) &&
                             !DeletedIds.Contains(change.id)
                             ).ToList().ForEach(change => 
                             myActivitiesList.Add(new ActivityReport()
                             {
                                 comment_id = change.id,
                                 change_type = change.change_type,
                                 has_attachment = false,
                                 comments = change.new_values.text.Replace("\n\n","<br/>")
                                                                  .Replace("\n","<br/>"),
                                 update_date = change.new_values.updated_at,
                                 project = act.project.name,
                                 story_id = act.primary_resources.FirstOrDefault().id,
                                 story = act.primary_resources.FirstOrDefault().name,
                                 story_type = act.primary_resources.FirstOrDefault().story_type,
                                 story_url = act.primary_resources.FirstOrDefault().url,
                                 occurred_at = act.occurred_at
                             }));

                    });
                    // order by latest change
                    List<ActivityReport> myLastestActivitiesList = new List<ActivityReport>();
                    myActivitiesList.GroupBy(comment => comment.comment_id).ToList().ForEach(group_comment =>
                    {
                        myLastestActivitiesList.Add(group_comment.OrderByDescending(comment => comment.update_date).First());
                    });

                    LatestActivities = myLastestActivitiesList;
                }
            }
            catch (Exception Ex)
            {
                return string.Format("Oops, Some thing went wrong : {0}", Ex.Message);
            }

            return LatestActivities;
        }


        public static dynamic Get(string activities)
        {
            try
            {
                return JsonConvert.DeserializeObject<List<Activity>>(activities);
            }
            catch (Exception Ex)
            {
                return string.Format("Oops, Some thing went wrong : {0}", Ex.StackTrace);
            }
        }
    }
}